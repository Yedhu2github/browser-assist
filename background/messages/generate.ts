import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { prompt } = req.body

  // 1. Ensure the Offscreen Document is running
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT]
  })

  if (existingContexts.length === 0) {
    await chrome.offscreen.createDocument({
      url: "tabs/offscreen.html", // Plasmo maps tabs/offscreen.tsx to this
      reasons: [chrome.offscreen.Reason.WORKERS],
      justification: "Running WebGPU for local LLM inference"
    })
  }

  // 2. Forward the prompt to the Offscreen Document
  // We use standard chrome messaging here because the Offscreen doc 
  // is a tab-like environment, not a Plasmo background message handler.
  const response = await chrome.runtime.sendMessage({
    target: "offscreen-ai-engine",
    prompt: prompt
  })

  // 3. Send the AI's answer back to the Popup
  res.send({
    message: response.answer
  })
}

// THIS IS THE PART THAT WAS MISSING:
export default handler