// @ts-nocheck
globalThis.__plasmoInternalPortMap = new Map()

import { default as messagesGenerate } from "~background/messages/generate"

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  switch (request?.name) {
    
    default:
      break
  }

  return true
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.name) {
    case "generate":
  messagesGenerate({
    ...request,
    sender
  }, {
    send: (p) => sendResponse(p)
  })
  break
    default:
      break
  }

  return true
})

chrome.runtime.onConnect.addListener(function(port) {
  globalThis.__plasmoInternalPortMap.set(port.name, port)
  port.onMessage.addListener(function(request) {
    switch (port.name) {
      
      default:
        break
    }
  })
})

