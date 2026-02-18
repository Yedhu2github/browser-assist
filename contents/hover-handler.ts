// contents/hover-handler.ts
import { sendToBackground } from "@plasmohq/messaging"
import { Readability } from "@mozilla/readability"
import { Storage } from "@plasmohq/storage"
const storage = new Storage()



/**
 * PRODUCTION CONFIGURATION
 */
const SCANNER_HEIGHT_VH = 40; 
const MIN_TEXT_LENGTH = 15;
const DEBOUNCE_MS = 250;

// Create the Scanner UI
const scannerBox = document.createElement('div');
Object.assign(scannerBox.style, {
  position: 'fixed', left: '0', width: '100vw', height: `${SCANNER_HEIGHT_VH}vh`,
  backgroundColor: 'rgba(0, 150, 255, 0.05)', borderTop: '2px solid #0096ff',
  borderBottom: '2px solid #0096ff', pointerEvents: 'none', zIndex: '2147483647',
  display: 'none', transform: 'translateY(-50%)'
});
document.body.appendChild(scannerBox);

/**
 * CORE LOGIC: Refined Extraction
 */
function extractPreciseData(mouseY) {
  const vh = window.innerHeight;
  const boxTop = mouseY - (vh * (SCANNER_HEIGHT_VH / 200));
  const boxBottom = mouseY + (vh * (SCANNER_HEIGHT_VH / 200));

  // 1. Identify all elements in the band
  const allElements = document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, mark, em, strong, div, section, article');
  
  const intersectingElements = [];
  allElements.forEach(el => {
    // Optimization: Skip elements with no text
    if (!el.textContent?.trim()) return;

    const rect = el.getBoundingClientRect();
    if (rect.bottom > boxTop && rect.top < boxBottom && rect.height > 0) {
      // Check if it's visible
      const style = window.getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
        intersectingElements.push(el);
      }
    }
  });

  // 2. Build a Virtual Tree while filtering "Junk"
  const virtualDoc = document.implementation.createHTMLDocument();
  const wrapper = virtualDoc.createElement('div');

  // Filter out nested duplicates (keep parents, discard children to avoid double text)
  const uniqueElements = intersectingElements.filter(el => {
    return !intersectingElements.some(parent => parent !== el && parent.contains(el));
  });

  uniqueElements.forEach(el => {
    // 3. Score the element for "Noise"
    const text = el.textContent || "";
    const links = el.querySelectorAll('a');
    let linkLength = 0;
    links.forEach(l => linkLength += l.textContent.length);
    
    // HEURISTIC: If > 50% of the text is a link, it's likely navigation noise
    const isNavigation = linkLength / text.length > 0.5;
    const isJunkTag = /footer|nav|sidebar|menu|ad-|social/i.test(el.className + " " + el.id);

    if (!isNavigation && !isJunkTag) {
      const clone = el.cloneNode(true);
      // Neutralize tags that Readability hates
      const problematicTags = clone.querySelectorAll('mark, aside, section');
      problematicTags.forEach(pt => {
        const s = virtualDoc.createElement('span');
        s.innerHTML = pt.innerHTML;
        pt.replaceWith(s);
      });
      wrapper.appendChild(clone);
    }
  });

  virtualDoc.body.appendChild(wrapper);

  // 4. Final Readability Pass
  // We use Readability as a "Format Smoother" rather than a "Hard Filter"
  const reader = new Readability(virtualDoc, {
    charThreshold: 0,
    classesToPreserve: ['*']
  });

  const article = reader.parse();
  return article ? article.textContent.trim().replace(/\s+/g, ' ') : "";
}

/**
 * PERFORMANCE HANDLER
 */
let lastText = "";
let timer = null;




// Your existing cleanup function
function cleanupPage() {
  const processedElements = document.querySelectorAll('[data-ai-read="true"]')
  processedElements.forEach((el: HTMLElement) => {
    delete el.dataset.aiRead
    el.style.boxShadow = ""
    el.style.backgroundColor = ""
    el.style.borderLeft = ""
    el.title = ""
  })
}
let hoverTimer: number

// Helper: Converts a DOM Node to Markdown-lite to preserve links
function getMarkdownWithLinks(node: Node): string {
  let text = ""
  
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement
      
      if (el.tagName === "A") {
        // Wrap links in Markdown syntax
        const href = (el as HTMLAnchorElement).href
        const linkText = el.innerText.trim()
        text += ` [${linkText}](${href}) `
      } else if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) {
        return // Ignore code/style blocks
      } else {
        // Recursively handle other nested tags (span, b, i, etc.)
        text += getMarkdownWithLinks(el)
      }
    }
  })
  return text
}
let page = ""; 
const listenter =(e) => {
  scannerBox.style.display = 'block';
  scannerBox.style.top = `${e.clientY}px`;

  clearTimeout(timer);
  timer = setTimeout(() => {
    const cleanText = extractPreciseData(e.clientY);
    
    if (cleanText.length > MIN_TEXT_LENGTH && cleanText !== lastText) {
      lastText = cleanText;
      page = `${page}" "${lastText}`;
      console.log("%c[DATA CAPTURED]", "color: #0096ff; font-weight: bold", cleanText);
      // chrome.runtime.sendMessage({ action: "CLASSIFY", text: cleanText });
    }
  }, DEBOUNCE_MS);
}
// // 1. Listen for changes in the "ai_active" key
//   const response = await sendToBackground({
//       name : "classify",
//       body: {prompt: cleanLine}
//     })
storage.watch({
  ai_active: (change) => {
    const isNowActive = change.newValue
    
    if (isNowActive === false) {
      cleanupPage() // Run your cleanup logic
      window.removeEventListener("mouseover", listenter );
      document.removeEventListener('mouseleave', () => scannerBox.style.display = 'none');
    }else{
        window.addEventListener("mouseover", listenter );
        document.addEventListener('mouseleave', () => scannerBox.style.display = 'none');

    }
    
    console.log(`Global AI State changed to: ${isNowActive}`)
  }
})

