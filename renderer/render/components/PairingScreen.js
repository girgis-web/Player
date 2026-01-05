
export async function PairingScreen(paring_code) {
  
  const qrPayload = `signage://pair/${paring_code}`;
  const qrDataUrl = await window.QR.Code(qrPayload);

  
  return `
    <div style="color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
      <img src="${qrDataUrl}" style="width:260px;height:260px;" />
      <div style="font-size:3rem;">${paring_code}</div>
    </div>
  `;
}


export function WaitingScreens() {
  return `
    <div style="
      color:white;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      height:100vh;
      gap:16px;
      font-family:-apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      text-align:center;
      background: radial-gradient(circle at top, rgba(255,255,255,0.15), transparent 60%);
    ">
      <div style="font-size:1.4rem; font-weight:600;">Display associato</div>
      <div style="font-size:1rem; opacity:0.8; max-width:420px;">
        Assegna una playlist a questo display dal pannello di gestione per avviare la riproduzione.
      </div>
      <div style="margin-top:20px; font-size:0.85rem; opacity:0.6;">
        In attesa di playlist...
      </div>
    </div>
  `;
	
	
}
