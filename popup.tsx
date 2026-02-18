import { useState, useEffect, type CSSProperties } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

export default function IndexPopup() {
  const [isLoaded, setIsLoaded] = useStorage("llm_loaded", false)
  const [isActive, setIsActive] = useStorage("ai_active", false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isInitializing, setIsInitializing] = useState(false)
const toggleAI = async () => {
  const newState = !isActive
  setIsActive(newState)

  // 1. Get ALL tabs
  const allTabs = await chrome.tabs.query({})

  // 2. Loop and send message to each
  // allTabs.forEach((tab) => {
  //   if (tab.id) {
  //     chrome.tabs.sendMessage(tab.id, {
  //       type: "TOGGLE_CONTENT_AI",
  //       active: newState
  //     }).catch((err) => {
  //       // We ignore errors because some tabs (like chrome://) 
  //       // don't allow content scripts to run
  //       console.debug(`Could not send message to tab ${tab.id}:`, err.message)
  //     })
  //   }
  // })

  // Also notify background
  await sendToBackground({
    name: "toggle",
    body: { action: "TOGGLE_STATE", active: newState }
  }).then(e=>{console.log(e);
  })
}
  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.type === "MODEL_PROGRESS") {
        setLoadingProgress(Math.round(msg.payload.progress * 100))
        if (msg.payload.progress === 1) setIsLoaded(true)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [setIsLoaded])

  const handleInit = async () => {
    setIsInitializing(true)
    await sendToBackground({ name: "toggle", body: { action: "INIT" } })
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Local AI Hub</h2>
      
      {!isLoaded ? (
        <div style={sectionStyle}>
          <p style={statusStyle}>Model not found in cache.</p>
          <button 
            onClick={handleInit} 
            disabled={isInitializing}
            style={isInitializing ? disabledBtn : primaryBtn}>
            {isInitializing ? `Loading ${loadingProgress}%` : "Initialize LLM"}
          </button>
        </div>
      ) : (
        <div style={sectionStyle}>
          <div style={statusRow}>
            <span style={activeLabel}>{isActive ? "AI is Live" : "AI is Standby"}</span>
            <div style={indicator(isActive)} />
          </div>
          
          <button 
            onClick={() => toggleAI()} 
            style={isActive ? activeBtn : inactiveBtn}>
            {isActive ? "Deactivate AI" : "Activate AI"}
          </button>
        </div>
      )}
    </div>
  )
}

// --- Minimalist Styles with TypeScript Fixes ---

const containerStyle: CSSProperties = { 
  padding: "20px", 
  width: "260px", 
  fontFamily: "Inter, system-ui, sans-serif", 
  textAlign: "center" as const, // 'as const' tells TS this is exactly "center"
  background: "#fdfdfd" 
}

const titleStyle: CSSProperties = { 
  fontSize: "16px", 
  fontWeight: 600, 
  marginBottom: "20px", 
  color: "#1a1a1a" 
}

const sectionStyle: CSSProperties = { 
  display: "flex", 
  flexDirection: "column", 
  gap: "12px" 
}

const statusStyle: CSSProperties = { 
  fontSize: "12px", 
  color: "#666" 
}

const statusRow: CSSProperties = { 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  gap: "8px", 
  marginBottom: "4px" 
}

const activeLabel: CSSProperties = { 
  fontSize: "11px", 
  textTransform: "uppercase", 
  letterSpacing: "0.5px", 
  fontWeight: 700 
}

// Helper for dynamic styles
const indicator = (active: boolean): CSSProperties => ({ 
  width: "8px", 
  height: "8px", 
  borderRadius: "50%", 
  background: active ? "#10b981" : "#d1d5db", 
  boxShadow: active ? "0 0 8px #10b981" : "none" 
})

const primaryBtn: CSSProperties = { 
  padding: "10px", 
  borderRadius: "8px", 
  border: "none", 
  background: "#3b82f6", 
  color: "white", 
  fontWeight: 500, 
  cursor: "pointer" 
}

const disabledBtn: CSSProperties = { 
  ...primaryBtn, 
  background: "#93c5fd", 
  cursor: "wait" 
}

const activeBtn: CSSProperties = { 
  ...primaryBtn, 
  background: "#ef4444" 
}

const inactiveBtn: CSSProperties = { 
  ...primaryBtn, 
  background: "#10b981" 
}