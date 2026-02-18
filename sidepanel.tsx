import { useState } from "react"

// No manifest 'side_panel' config needed in package.json! 
// Plasmo handles that automatically because of the filename.

function SidePanel() {
  return (
    <div style={{ padding: 6 }}>
      <h1>Browsenote ai assistant</h1>
      <button>Go to dashboard</button>
      <h2>Instructions</h2>
      <p>Instructions given to the ai assistant while processing the data you browse </p>
      <input type="text"  /> <br /><br />
      <button>update instructions</button>
      <h2>Current Instructions</h2>
      <p><i><q>You are supposed to collect the companies data in the format ##Company name ###MRR ###Valuation ###founder ###CEO ###founding year, the finaly output should be in this format, ignore any other data</q></i></p>
    <br /><br /><br />
    <br /><br /><br />
    <br /><br /><br />
    <p>
    Your trial ends in 7 days
    </p>
    <button>Upgrade to pro to get complete access</button> 
    </div>
  )
}

export default SidePanel