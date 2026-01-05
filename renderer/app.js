// renderer/app.js
import { createPlayerEngine } from "./core/PlayerEngine.js";
import { logInfo } from "./utils/logger.js";
import { applyScreenMask } from "./render/applyScreenMask.js";
import { onOffline, onOnline } from "./offline/offlineGuard.js";

window.PLAYER_VERSION = "1.0.0";

onOffline(() => {
  console.log("OFFLINE MODE");
});

onOnline(() => {
  console.log("ONLINE MODE");
});

window.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("root");

  // 🔥 VirtualCanvas deve esistere SEMPRE
  window.VirtualCanvas = root;

  const setPlayerContent = (html) => {
    if (!root) return;
    root.innerHTML = html;
  };

  const env = window.supabaseAPI.Env();
  const config = window.Config.loadConfig();

  logInfo("Env:", env);
  logInfo("Config:", config);

  const engine = createPlayerEngine(env, config, setPlayerContent);
  await engine.init();

  // Applica la maschera allo schermo primario
  window.System.getDisplays().then((displays) => {
    const primary = displays.find((d) => d.isPrimary);
    if (!primary) return;

    applyScreenMask({
      x: primary.x,
      y: primary.y,
      width: primary.width,
      height: primary.height,
    });
  });
});
