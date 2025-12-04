<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1sFXCfTOXMNI4bQmJiG9oxT_8utoSHOSj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Start both the frontend and the API together (API data persists under `server/data/db.json`):
   `npm run dev`
   - If you only need the API running, you can still use: `npm run server`
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
