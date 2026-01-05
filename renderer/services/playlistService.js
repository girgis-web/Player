import { logInfo, logError } from "../utils/logger.js";
import { getActiveCampaignForDisplay } from "./schedulingService.js";

export async function loadPlaylistForDisplay(displayId) {
  // 1) campagna attiva
  const active = await getActiveCampaignForDisplay(displayId);

  if (!active || !active.playlistId) {
    logInfo("Nessuna campagna attiva per display:", displayId);
    return null;
  }

  const playlistId = active.playlistId;

  const { data, error } = await window.supabaseAPI.fetchPlaylist(playlistId);
  if (error) {
    logError("Errore caricando playlist:", error);
    return null;
  }

  const items = Array.isArray(data) ? data : [];

  return {
    id: playlistId,
    items: items.map(item => ({
      id: item.id,
      type: item.contents?.type,
      duration_seconds: item.duration_seconds,
      contents: item.contents
    }))
  };
}
