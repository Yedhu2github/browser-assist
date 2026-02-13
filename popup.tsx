import { useState, useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  
  // New state for the progress loader
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")

  useEffect(() => {
    // 1. Listen for progress broadcasts from the offscreen page
    const progressListener = (message) => {
      if (message.type === "MODEL_PROGRESS") {
        setProgress(Math.round(message.payload.progress * 100))
        setStatusText(message.payload.text)
      }
    }

    chrome.runtime.onMessage.addListener(progressListener)
    return () => chrome.runtime.onMessage.removeListener(progressListener)
  }, [])

  const handleSend = async () => {
    setLoading(true)
    setOutput("")
    
    // 2. Trigger the generation via background
    const resp = await sendToBackground({
      name: "generate",
      body: { prompt: input }
    })

    setOutput(resp.message)
    setLoading(false)
    setStatusText("") // Clear progress status when done
  }

  return (
    <div style={{ padding: 16, width: 350 }}>
      <textarea 
        style={{ width: "100%", height: "80px" }}
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      
      <button onClick={handleSend} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "AI is Busy..." : "Generate"}
      </button>

      {/* 3. The Loader UI */}
      {loading && statusText && (
        <div style={{ marginTop: 15, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ fontSize: "12px", marginBottom: 5 }}>{statusText}</div>
          <div style={{ background: "#eee", borderRadius: 4, height: 10, width: "100%" }}>
            <div style={{ 
              background: "#4CAF50", 
              height: "100%", 
              width: `${progress}%`, 
              borderRadius: 4,
              transition: "width 0.3s" 
            }} />
          </div>
          <div style={{ textAlign: "right", fontSize: "10px" }}>{progress}%</div>
        </div>
      )}

      {output && (
        <div style={{ marginTop: 15, background: "#f9f9f9", padding: 10 }}>
          <strong>Response:</strong>
          <p>{output}</p>
        </div>
      )}
    </div>
  )
}

export default IndexPopup