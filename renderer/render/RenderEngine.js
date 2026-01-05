// renderer/render/RenderEngine.js
import { ImageRenderer } from "./components/ImageRenderer.js";
import { VideoRenderer } from "./components/VideoRenderer.js";
import { getFitMode } from "./fitMode.js";
import { logInfo, logError } from "../utils/logger.js";
import { SceneRenderer } from "./SceneRenderer.js";
import { getCachedAsset } from "../cache/assetCache.js";

export function startRenderLoop(state, setPlayerContent, projectionMode) {
  async function loop() {
    if (!state.playlist || state.playlist.length === 0) return;

    const item = state.playlist[state.currentIndex];
    const content = item.contents;

    logInfo("ITEM:", item);
    logInfo("CONTENT:", content);

    if (!content) {
      state.nextItem();
      return loop();
    }

    const type = content.type?.toLowerCase();

    let localPath;
    try {
      const cached = getCachedAsset(item.id);
      localPath = cached || await window.supabaseAPI.getCachedContent(content);
    } catch (err) {
      logError("Errore caricamento contenuto in cache:", err);
      state.nextItem();
      return loop();
    }

    const fit = getFitMode(type, content, projectionMode);
    let html = "";

    // 🚀 KILLING FEATURE: Instant Content Transitions with Overlay Pre-rendering
    // We create a double-buffer effect by pre-rendering the next content in an invisible layer
    const oldLayer = window.VirtualCanvas.querySelector('.active-layer');
    const newLayer = document.createElement('div');
    newLayer.className = 'active-layer';
    newLayer.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; transition:opacity 0.8s ease-in-out;';
    
    if (type === "scene") {
      const sceneId = content.scene_id;
      const { data: scenes } = await window.supabaseAPI.getScenes(state.wall?.id);
      const scene = scenes?.find(s => s.id === sceneId);
      const { data: regions } = await window.supabaseAPI.getSceneRegions(sceneId);
      newLayer.innerHTML = SceneRenderer(scene, regions, {});
    } else if (type === "immagine" || type === "image") {
      newLayer.innerHTML = ImageRenderer(localPath, fit);
    } else if (type === "video") {
      newLayer.innerHTML = VideoRenderer(localPath, fit);
    }

    window.VirtualCanvas.appendChild(newLayer);
    
    // Smooth Cross-fade Transition
    setTimeout(() => {
      newLayer.style.opacity = '1';
      if (oldLayer) {
        oldLayer.style.opacity = '0';
        setTimeout(() => oldLayer.remove(), 800);
      }
    }, 50);

    state.renderTimeout = setTimeout(() => {
      state.nextItem();
      loop();
    }, (item.duration_seconds || 10) * 1000);
  }

  loop();
}
