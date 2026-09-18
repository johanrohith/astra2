# ASTRA Chat

A ChatGPT-style responsive web app.

## Run
Open `index.html` in a browser, or serve this folder with any static web server.

## Connect a real AI backend
Open **Settings** and set an API endpoint. The app sends:

```json
{"messages":[{"role":"user","content":"Hello"}]}
```

It accepts a JSON response containing `reply`, `message`, or `content`.

For production, keep your AI provider API key on the server, not in the browser.

## Included
- Responsive ChatGPT-style UI
- New chat and local conversation history
- Clear conversation
- Settings modal
- Custom API endpoint
- Mobile layout
- PWA manifest
