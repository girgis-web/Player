# Digital Signage Player

## Overview
A professional digital signage player built with Electron. This desktop application displays digital signage content, supporting multiple displays, playlists, and real-time content updates via Supabase.

## Project Structure
```
/
├── main/               # Electron main process
│   └── main.cjs        # App entry point, window management, IPC handlers
├── preload/            # Preload scripts for IPC bridge
│   ├── preload.cjs     # IPC bridge between main and renderer
│   ├── supabaseClient.cjs # Supabase client configuration
│   ├── env.json        # Environment configuration
│   └── player-config.json # Player-specific configuration
├── renderer/           # Frontend (renderer process)
│   ├── core/           # Core player engine
│   ├── render/         # Rendering components
│   ├── services/       # Backend services (heartbeat, playlist, etc.)
│   ├── cache/          # Asset caching
│   ├── offline/        # Offline support
│   └── index.html      # Main HTML entry point
├── package.json        # Node.js dependencies
└── electron-builder.yml # Electron Builder config for packaging
```

## Running the Application
This is a desktop Electron application that runs in VNC mode on Replit.

The workflow runs:
```
/nix/store/.../electron --no-sandbox --disable-gpu-sandbox .
```

## Configuration
- Backend URL and Supabase settings are configured in `preload/env.json`
- The app connects to a Supabase backend for real-time updates

## System Dependencies
Requires Electron from Nix packages (installed as system dependency) along with X11/GUI libraries.

## Notes
- Uses VNC output type for GUI display
- D-Bus and GPU initialization errors in logs are expected in the Replit environment and do not affect functionality
- The app uses software rendering when hardware acceleration is unavailable
