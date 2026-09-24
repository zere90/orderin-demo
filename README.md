# OrderIN — interactive demo

One inbox for Instagram and WhatsApp orders, with AI that turns messages into paid orders.
This is a clickable prototype with **sample data** (a home bakery in Astana). No real APIs, payments or customers.

Team: Islam Ardak, Zere Zhussupbekova (IT-2401, Astana IT University)

## Demo flow

1. Open Dana's Instagram message in **Inbox**
2. Check the order the AI extracted and tap **Create order and send Kaspi payment link**
3. Tap **Customer paid (simulate)**
4. Open **Stock**: the honey cake count went down
5. Open **Today**: revenue and messages sorted by AI

**Reset demo** restores the starting state.

## Files

| File | What it holds |
|------|---------------|
| `index.html` | Page layout: guide on the left, phone frame on the right |
| `styles.css` | Colors (light and dark theme at the top), fonts, components |
| `app.js` | Sample data and all app logic |

## Where to edit

- **Products and prices**: `PRODUCTS0` at the top of `app.js`
- **Chats, messages and what the AI "detects"**: `THREADS0` in `app.js`
  - `kind: 'order'` shows the AI order card (`ai.items`, `ai.when`, `ai.how`, `ai.conf`)
  - `kind: 'question'` shows an AI reply draft (`reply`)
- **Existing orders on start**: `orders` inside `reset()` in `app.js`
- **Chart on the Today tab**: `week` and `days` in `renderToday()`
- **Colors**: the `--accent`, `--ink`, `--bg` variables at the top of `styles.css`
- **Guide text on the left**: `index.html`

## Run locally

Open `index.html` in a browser, or in VS Code install the **Live Server** extension, right-click `index.html` → **Open with Live Server** (the page reloads on every save).

## Publish on GitHub Pages

```bash
git init
git add .
git commit -m "OrderIN demo"
git branch -M main
git remote add origin https://github.com/<your-username>/orderin-demo.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save**.
After a minute the demo is live at `https://<your-username>.github.io/orderin-demo/`.
