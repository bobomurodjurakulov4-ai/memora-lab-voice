# MEMORA LAB Voice

## Render deploy
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Root Directory: leave blank when these files are at the repository root.

Upload the contents of this folder to the root of the GitHub repository (not the ZIP file itself), then commit the changes and deploy on Render.

## Enable live voice rooms
Create a LiveKit project and add these three environment variables in Render → Environment:
- `LIVEKIT_URL` — your LiveKit WebSocket URL, usually starts with `wss://`
- `LIVEKIT_API_KEY` — LiveKit API key
- `LIVEKIT_API_SECRET` — LiveKit API secret

Do not publish or share the API secret. Without these values, the website can load but live voice joining will show a setup message.
