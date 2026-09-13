# 🎨 Frontend - Browser AI

Next.js + React frontend a Browser AI webalkalmazáshoz.

## 📁 Struktúra

```
frontend/
├── app/
│   ├── layout.js           # Root layout
│   ├── page.js             # Main chat interface
│   ├── page.module.css     # Page styles
│   ├── globals.css         # Global styles
│   └── api/                # Next.js API routes (TBD)
├── components/             # React komponensek (TBD)
│   ├── ChatBox.jsx
│   ├── MailPanel.jsx
│   ├── FileUpload.jsx
│   └── VoiceInput.jsx
├── hooks/                  # Custom React hooks (TBD)
├── utils/                  # Utility functions (TBD)
├── package.json
├── next.config.js
└── .env.example
```

## 🔧 Telepítés

```bash
npm install
cp .env.example .env.local
```

## 🔐 Konfigurálás

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃 Futtatás

### Development

```bash
npm run dev
```

App fut: `http://localhost:3000`

### Production

```bash
npm run build
npm start
```

## 🎨 UI/UX

- **Dark mode** - Sötét téma alapértelmezettként
- **Responsive** - Teljes mobil támogatás
- **Real-time** - WebSocket alapú live chat
- **Smooth animations** - Sima átmenetek

## 📱 Komponensek (TBD)

### ChatBox
- Üzenetek megjelenítése
- Input field
- Send button
- Scroll to bottom

### MailPanel
- Email lista
- Email olvasás
- Email új írása
- Search

### FileUpload
- Fájl feltöltés
- Drag & drop
- Progress bar

### VoiceInput
- Mikrofon input
- STT (Beszéd → Szöveg)
- TTS (Szöveg → Beszéd)

## 🎯 Fejlesztési folyamat

1. ✅ Chat interface
2. ⬜ Gmail integrálás
3. ⬜ Google Drive integrálás
4. ⬜ Fájl feltöltés
5. ⬜ Hangalapú funkciók
6. ⬜ Böngészési panel

## 🔌 API Integráció

```javascript
// WebSocket alapú kommunikáció
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log('Response:', response);
};

ws.send(JSON.stringify({ content: 'Hello' }));
```

## 🌐 Browserkompatibilitás

- ✅ Chrome/Edge (legfrissebb)
- ✅ Firefox (legfrissebb)
- ✅ Safari (14+)
- ✅ Mobile browsers

## 📝 CSS Változók

```css
:root {
  --primary: #3b82f6;           /* Kék */
  --primary-dark: #1e40af;      /* Sötétkék */
  --background: #0f172a;        /* Szinte fekete */
  --surface: #1e293b;           /* Sötét szürke */
  --text: #f1f5f9;              /* Fehér */
}
```

## 🚀 Build & Deploy

```bash
# Production build
npm run build

# Local testing
npm start

# Optimize
npm run lint
```

## 💡 Fejlesztési tippek

- ESLint: `npm run lint`
- Live reload: Automatikus dev módban
- CSS-in-JS: Global CSS + CSS Modules
