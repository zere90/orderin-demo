# Qazyna interactive demo

One inbox for Instagram and WhatsApp orders, with AI that turns messages into paid orders.
This is a clickable prototype with sample data (a home bakery in Astana). No real APIs, payments or customers.

Team: Ikhsanova Aziza, Zere Zhussupbekova (Astana IT University)

Live demo: https://zere90.github.io/qazyna-demo/

## Demo flow

1. Open Dana's Instagram message in Inbox
2. Check the order the AI extracted and tap "Create order and send Kaspi payment link"
3. Tap "Customer paid (simulate)"
4. Open Stock: the honey cake count went down
5. Open Today: revenue and messages sorted by AI

The "Reset demo" button restores the starting state.

## Files

- index.html: page layout, guide on the left and phone frame on the right
- styles.css: colors (light and dark theme at the top), fonts, components
- app.js: sample data and all app logic

## Where to edit

- Products and prices: PRODUCTS0 at the top of app.js
- Chats, messages and what the AI detects: THREADS0 in app.js
  - kind 'order' shows the AI order card (ai.items, ai.when, ai.how, ai.conf)
  - kind 'question' shows an AI reply draft (reply)
- Existing orders on start: orders inside reset() in app.js
- Chart on the Today tab: week and days in renderToday()
- Colors: the accent, ink and bg variables at the top of styles.css
- Guide text on the left: index.html

## Run locally

Open index.html in a browser. In VS Code you can install the Live Server extension, right-click index.html and choose Open with Live Server. The page reloads on every save.
