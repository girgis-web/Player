import { logInfo, logError } from "../utils/logger.js";
import { getActiveCampaignForDisplay } from "./schedulingService.js";

export async function loadPlaylistForDisplay(displayId) {
  try {
    // 1) Get active campaign
    const active = await getActiveCampaignForDisplay(displayId);

    if (!active || !active.playlistId) {
      logInfo("No active campaign for display:", displayId);
      return null;
    }

    const playlistId = active.playlistId;

    const { data, error } = await window.supabaseAPI.fetchPlaylist(playlistId);
    if (error) {
      logError("Error loading playlist:", error);
      return null;
    }

    const items = Array.isArray(data) ? data : [];

    if (items.length === 0) {
      logInfo("Playlist is empty:", playlistId);
      return null;
    }

    return items;
  } catch (err) {
    logError("Exception in loadPlaylistForDisplay:", err);
    return null;
  }
}
