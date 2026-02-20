import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action,active } = req.body;

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
      target: "toggle",
      active: active,
    });
    res.send(true);
  

  
};

// THIS IS THE PART THAT WAS MISSING:
export default handler;
