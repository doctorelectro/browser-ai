# 🤖 Browser AI - Multi-Functional AI Assistant

Egy teljes AI asszisztens rendszer nonprofit célra, amely támogatja a Gmail kezelést, Google Drive integrációt, webes böngészést, Python futtatást, hangalapú kommunikációt és még sok mást!

## 🎯 Funkciók

- ✅ **Chat alaprendszer** - WebSocket alapú real-time kommunikáció
- ✅ **Gmail integrálás** - Emailek olvasása, írása, elemzése
- ✅ **Google Drive** - Fájlok kezelése, feltöltés, letöltés
- ✅ **Webes böngészés** - Automatikus kattintgatás, screenshot
- ✅ **Hangalapú** - TTS (szöveg-beszéd) és STT (beszéd-szöveg)
- ✅ **Python executor** - Kódok futtatása
- ✅ **Canva integráció** - Grafikai tervek készítése
- ✅ **PDF támogatás** - Dokumentumok feldolgozása
- ✅ **Hosszú memória** - Vector embedding adatbázis
- ✅ **Magyar nyelvű** - Teljes HU támogatás

## 🏗️ Projekt Struktúra

```
browser-ai/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── index.js     # Main server
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utilities
│   │   └── config/      # Configuration
│   ├── package.json
│   └── .env.example
├── frontend/            # Next.js React app
│   ├── app/
│   │   ├── page.js     # Main chat interface
│   │   ├── layout.js
│   │   └── globals.css
│   ├── package.json
│   └── next.config.js
└── package.json         # Root workspace config
```

## 🚀 Telepítés & Futtatás

### Előfeltételek
- Node.js 18+
- npm 9+
- Git

### 1. Klónozás és szükségletek telepítése

```bash
cd /Users/isty/browser-ai

# Telepítés az összes workspace-hez
npm install
```

### 2. Környezeti változók beállítása

```bash
# Backend .env
cp backend/.env.example backend/.env
# Szerkeszd a backend/.env fájlt és add meg az API kulcsokat

# Frontend .env
cp frontend/.env.example frontend/.env
```

### 3. Szerver indítása

**Terminal 1 - Backend:**
```bash
npm run dev --workspace=browser-ai-backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev --workspace=browser-ai-frontend
```

Az alkalmazás elérhető lesz a `http://localhost:3000` címen.

## 🔧 API Konfiguráció

### Azure OpenAI

```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo
```

[Azure OpenAI dokumentáció](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)

### Google APIs

1. Menj a [Google Cloud Console](https://console.cloud.google.com/)
2. Hozz létre egy új projektet
3. Engedélyezd az alábbi API-kat:
   - Gmail API
   - Google Drive API
   - Google Speech-to-Text API
   - Google Text-to-Speech API
4. Hozz létre OAuth 2.0 tanúsítványokat

```env
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

### Vector Database (Memória)

#### Pinecone

```env
PINECONE_API_KEY=your_key
PINECONE_INDEX_NAME=browser-ai
PINECONE_ENVIRONMENT=your_env
USE_WEAVIATE=false
```

#### vagy Weaviate (lokális)

```bash
# Weaviate Docker konténer
docker run -d \
  -p 8080:8080 \
  --name weaviate \
  semitechnologies/weaviate:latest
```

```env
WEAVIATE_URL=http://localhost:8080
USE_WEAVIATE=true
```

## 📱 Responsive Design

Az alkalmazás teljesen mobilbarát:
- **Desktop** (1024px+) - Optimális felhasználói élmény
- **Tablet** (768px-1023px) - Adaptív layout
- **Mobil** (< 768px) - Touch-friendly interface

## 💰 Költségvetés (2000 USD/év)

| Tétel | Havi költség |
|-------|------------|
| Azure OpenAI API | $80-120 |
| Google APIs | $20-30 |
| Vector DB | $0-20 |
| Hosting | $0-10 |
| **Összesen** | **~$140 USD/hó** |

## 📝 Lépések a Fejlesztéshez

1. ✅ **Projektstruktúra** - Backend & Frontend scaffold
2. ⬜ **Gmail integráció** - Emailek kezelése
3. ⬜ **Google Drive** - Fájl feltöltés/letöltés
4. ⬜ **AI logika** - Azure OpenAI + Vector DB
5. ⬜ **Böngészés** - Selenium/Puppeteer
6. ⬜ **Hangalapú** - Google Cloud Speech-to-Text/Text-to-Speech
7. ⬜ **Python executor** - Biztonságos kódfuttatás
8. ⬜ **Canva connector** - Grafikai integráció
9. ⬜ **Adatimport** - Régi AI-ből való migrálás

## 🛠️ Technológiai Stack

**Backend:**
- Express.js - Web keretrendszer
- WebSocket - Real-time kommunikáció
- Axios - HTTP kliens
- Pino - Logging

**Frontend:**
- Next.js 14 - React keretrendszer
- React 18 - UI library
- CSS3 - Stílusozás

**AI & Integráció:**
- Azure OpenAI API
- Google Cloud APIs
- Pinecone / Weaviate - Vector DB

## 📞 Támogatás

Az alkalmazás fejlesztése közben szükséges bármilyen konfigurációs segítségre, az `.env.example` fájlok adnak útmutatást.

## 📄 Licencia

MIT

---

**Készült:** 2026.09.13  
**verzió:** 1.0.0
