// renderer/core/PlayerEngine.js
import { PlayerState } from "./PlayerState.js";
import { logInfo, logError } from "../utils/logger.js";

import { registerDisplayIfNeeded, getDisplayInfo } from "../services/displayService.js";
import { syncScreens, setupRealtimeScreenEvents } from "../services/screenService.js";
import { loadPlaylistForDisplay } from "../services/playlistService.js";
import { startHeartbeat } from "../services/heartbeatService.js";
import { startRenderLoop } from "../render/RenderEngine.js";

import { PairingScreen } from "../render/components/PairingScreen.js";
import { WaitingScreens } from "../render/components/WaitingScreen.js";

import { createVirtualCanvas } from "../render/VirtualCanvas.js";
import { computeScreenMapping } from "../services/mappingService.js";
import { startCommandListener } from "../services/commandService.js";

import { savePlaylistToCache, loadPlaylistFromCache } from "../offline/cacheService.js";
import { isOffline } from "../offline/offlineGuard.js";

import { preloadAssets } from "../cache/preloader.js";
import { getCachedAsset } from "../cache/assetCache.js";

export function createPlayerEngine(env, initialConfig, setPlayerContent) {
  async function init() {
    try {
      PlayerState.setMode("boot");
      logInfo("PlayerEngine init");

      let config = { ...initialConfig };

      // 1) Registrazione display se necessario
      const regResult = await registerDisplayIfNeeded(env, config);
      if (!regResult.displayId_Found) {
        // Nessun displayId: mostro pairing screen e MI FERMO
        PlayerState.setMode("pairing");
        const payload = `signage://pair/${regResult.pairingCode}`;
        setPlayerContent(PairingScreen(regResult.pairingCode, payload));
        return;
      }

      config = regResult.config;

      // 2) Ottieni info display dal backend + Supabase
      const displayInfo = await getDisplayInfo(env, config);
      PlayerState.setDisplayInfo(displayInfo);

      // 2.1) OFFLINE MODE — va gestita come priorità assoluta
      if (displayInfo?.offline === true) {
        logInfo("Avvio in modalità offline (nessun backend)");

        // In offline, usiamo il root come "canvas logico" minimo
        if (!window.VirtualCanvas) {
          const root = document.getElementById("root");
          window.VirtualCanvas = root;
        }

        // Tentiamo periodicamente di riconnetterci al backend
        startBackendRetry(env, config);

        await reloadPlaylistAndRender(config);
        return;
      }

      // 2.2) DisplayId non valido (eliminato da Supabase, ecc.)
      if (!displayInfo.exists) {
        logInfo("DisplayId non valido, reset già eseguito, riavvio il player tra 1s");

        // getDisplayInfo DEVE aver già fatto:
        // config.displayId = null; window.Config.saveConfig(config);
        setTimeout(() => {
          location.reload();
        }, 1000);

        return;
      }

      // 2.3) Display esistente ma non ancora associato (pairing)
      if (displayInfo.unpaired) {
        PlayerState.setMode("pairing");
        const pairingCode = displayInfo.pairing_code || config.pairingCode;
                const html = await PairingScreen(pairingCode);
                setPlayerContent(html);
        return;
      }

      // Da qui in poi: display esiste, è paired e abbiamo displayInfo.display
      const display = displayInfo.display;
      if (!display) {
        logError("displayInfo.display mancante nonostante exists=true, unpaired=false");
        setPlayerContent(`<div style="color:white;">Errore: display mancante</div>`);
        return;
      }

      // 3) Sync screens (monitor fisici) e realtime
      await syncScreens(config, displayInfo);
      setupRealtimeScreenEvents(config);

      // 4) Configurazione wall + VirtualCanvas
      // QUI non usiamo più pixel_width/height sul display direttamente,
      // ma lasciamo la responsabilità al mapping RPC (wall)
      const wallId = display.wall_id;

      if (!wallId) {
        logError("Display senza wall associato (wall_id null)");
        setPlayerContent(
          `<div style="color:white;font-size:32px;">
            Display associato ma nessun wall configurato.<br/>
            Configura un wall nel backend.
           </div>`
        );
        return;
      }

      const mapping = await computeScreenMapping(wallId);
      if (!mapping) {
        setPlayerContent(
          `<div style="color:white;font-size:32px;">
            Configurazione wall non disponibile.<br/>
            Verifica la RPC get_wall_configuration e il mapping nel backend.
           </div>`
        );
        return;
      }

      PlayerState.wall = mapping.wall;
      PlayerState.screens = mapping.screens;
      PlayerState.mapping = mapping.mapping;

      const wallConfig = {
        pixel_width: mapping.wall?.pixel_width || 1920,
        pixel_height: mapping.wall?.pixel_height || 1080
      };

      const canvas = createVirtualCanvas(wallConfig);
      document.body.appendChild(canvas);
      window.VirtualCanvas = canvas;

      // 5) Heartbeat + command listener
      startHeartbeat(env, config.displayId);
      startCommandListener(config, { reloadPlaylistAndRender, forceScene });

      // 6) Playlist + render loop
      await reloadPlaylistAndRender(config);

    } catch (err) {
      logError("Errore critico in init PlayerEngine:", err);
      PlayerState.setMode("error");
      setPlayerContent(`<div style="color:white;">Errore critico player</div>`);
    }
  }

  function startBackendRetry(env, config) {
    setInterval(async () => {
      try {
        const info = await getDisplayInfo(env, config);

        if (!info.offline) {
          logInfo("Backend tornato online, riavvio player");
          location.reload();
        }
      } catch (err) {
        // backend ancora offline, silenzio
      }
    }, 50000); // ogni 50 secondi
  }

  async function reloadPlaylistAndRender(config) {
    let playlist = null;

    try {
      if (isOffline()) {
        logInfo("Offline mode detected, loading from cache...");
        playlist = loadPlaylistFromCache();
      } else {
        playlist = await loadPlaylistForDisplay(config.displayId);
        if (playlist) {
          savePlaylistToCache(playlist);
          logInfo("Playlist saved to cache for offline robustness");
        }
      }
    } catch (err) {
      logError("Error during playlist loading, attempting fallback to cache:", err);
      playlist = loadPlaylistFromCache();
    }

    if (!playlist) {
      logError("Critical: No playlist available (online or offline)");
      setPlayerContent(`<div style="color:white;font-size:48px;background:black;height:100vh;display:flex;align-items:center;justify-content:center;">Offline - No Cache Content Available</div>`);
      
      // Retry logic if no content at all
      setTimeout(() => reloadPlaylistAndRender(config), 30000);
      return;
    }

    try {
      await preloadAssets(playlist);
      PlayerState.setPlaylist(playlist);
      startRenderLoop(PlayerState, setPlayerContent);
    } catch (err) {
      logError("Error during asset preloading/rendering:", err);
      // Even if preloading fails partly, try to start render loop as fallback
      PlayerState.setPlaylist(playlist);
      startRenderLoop(PlayerState, setPlayerContent);
    }
  }

  async function forceScene(sceneId) {
    PlayerState.clearRenderTimeout();
    const html = `<div style="color:white;font-size:48px;">Scene ${sceneId}</div>`;
    setPlayerContent(html);
  }

  return {
    init,
    reloadPlaylistAndRender,
    forceScene
  };
}
