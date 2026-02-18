import type { PlasmoMessaging } from "@plasmohq/messaging";


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { prompt } = req.body;

  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
  });

  if (existingContexts.length === 0) {
    await chrome.offscreen.createDocument({
      url: "tabs/offscreen.html", 
      reasons: [chrome.offscreen.Reason.WORKERS],
      justification: "Running WebGPU for local LLM inference",
    });
  }

  const response = await chrome.runtime.sendMessage({
    target: "classify-text",
    prompt: prompt,
  });

  console.log("Response from offscreen:", response);
  
  res.send({
    message: response.label,
  });
}

export default handler;