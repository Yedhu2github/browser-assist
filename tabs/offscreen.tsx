import { CreateMLCEngine } from "@mlc-ai/web-llm"

let engine = null

async function runInference(prompt: string) {
  if (!engine) {
    // initProgressCallback sends updates to the rest of the extension
    engine = await CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC", {
      initProgressCallback: (report) => {
        // Broadcast the progress to the Popup
        chrome.runtime.sendMessage({
          type: "MODEL_PROGRESS",
          payload: {
            progress: report.progress, // 0 to 1
            text: report.text          // Status message like "Fetching weights..."
          }
        })
      }
    })
  }

  const completion = await engine.chat.completions.create({
  messages: [
    { 
      role: "system", 
      content: `You are a summarizer. You will receive text in Markdown format containing links like [text](url). 
                Summarize the content concisely and, if a link is highly relevant to the summary, include it as a reference.` 
    },
    { role: "user", content: prompt }
  ]
})
  return completion.choices[0].message.content
}

// Same listener as before
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === "offscreen-ai-engine") {
    runInference(message.prompt).then((result) => {
      sendResponse({ answer: result })
    })
    return true
  }
})

export default function OffscreenPage() {
  return <div>AI Engine Running...</div>
}