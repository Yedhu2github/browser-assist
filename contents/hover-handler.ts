// contents/hover-handler.ts
import { sendToBackground } from "@plasmohq/messaging"

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

window.addEventListener("mouseover", (e) => {
  const target = e.target as HTMLElement
  const container = target.closest("p, div, li, article") as HTMLElement
  
  if (!container || container.dataset.aiRead === "true") return

  window.clearTimeout(hoverTimer)
  
  hoverTimer = window.setTimeout(async () => {
    // 1. EXTRACT: Use our new link-preserving function
    const markdownContent = getMarkdownWithLinks(container)
    
    // 2. FLATTEN: Clean up whitespace and newlines into a single line
    const cleanLine = markdownContent.replace(/\s+/g, ' ').trim()

    if (cleanLine.length < 30) return 

    container.dataset.aiRead = "true"
    container.style.borderLeft = "4px solid #3b82f6" // Visual cue (blue for "reading")
    setTimeout(()=>{ container.style.borderLeft = "none"},1000)

    // 3. SEND: The LLM now sees the links inside the text
    const response = await sendToBackground({
      name: "generate",
      body: { prompt: cleanLine }
    })

    container.title = response.message
    container.style.backgroundColor = "rgba(59, 130, 246, 0.05)"
  }, 800)
})