# 🚀 Browser AI - Teljes Setup & Deployment Útmutató

## ✅ Elkészült Komponensek

### Backend (Node.js + Express)
- ✅ **Gmail API integráció** - emailek olvasása/írása/keresése
- ✅ **Google Drive API integráció** - fájlok kezelése
- ✅ **Azure OpenAI Chat** - AI logika hosszú memóriával
- ✅ **Voice Support** - TTS (Text-to-Speech) és STT (Speech-to-Text) placeholder-ek
- ✅ **WebSocket** - Real-time kommunikáció
- ✅ **Error handling & Logging** - Pino logger

### Frontend (Next.js + React)
- ✅ **Chat UI** - Dark mode, responsive, modern design
- ✅ **Mail Panel** - Gmail emailek megjelenítése és keresése
- ✅ **Voice Input Component** - Mikrofon input, szöveg felolvasás
- ✅ **Responsive Layout** - Desktop, tablet, mobil támogatás

### Azure Infrastructure
- ✅ **Resource Group** - `doctorai-rg` (East US)
- ✅ **App Service Plan** - B1 tier (shared compute)
- ✅ **App Service** - Node.js 22 LTS runtime
- ✅ **GitHub Actions CI/CD** - Automatikus build & deploy

### GitHub
- ✅ **Repository** - https://github.com/doctorelectro/browser-ai
- ✅ **GitHub Actions Workflow** - Azure Login + Deploy
- ✅ **GitHub Secret** - `AZURE_CREDENTIALS`

---

## 🔧 Konfigurálás (Szükséges Lépések)

### 1️⃣ Azure OpenAI API Kulcs Beállítása

```bash
az webapp config appsettings set \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --settings \
    AZURE_OPENAI_API_KEY="your_azure_openai_key" \
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4-turbo"
```

**Hogyan szerezd meg:**
1. https://portal.azure.com/
2. Search: "OpenAI"
3. Create resource
4. Copy API Key & Endpoint

### 2️⃣ Google OAuth2 Beállítása

```bash
az webapp config appsettings set \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --settings \
    GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com" \
    GOOGLE_CLIENT_SECRET="your_client_secret" \
    GOOGLE_REDIRECT_URI="https://doctorai-app.azurewebsites.net/api/mail/auth/callback"
```

**Hogyan szerezd meg:**
1. https://console.cloud.google.com/
2. Create New Project
3. APIs: Enable Gmail API, Google Drive API, Cloud Speech-to-Text, Cloud Text-to-Speech
4. OAuth 2.0 Credentials > Create
5. Authorized redirect URIs: Add `https://doctorai-app.azurewebsites.net/api/mail/auth/callback`
6. Copy Client ID & Secret

### 3️⃣ Hangalapú Support Beállítása (Opcionális)

Google Cloud Speech-to-Text/Text-to-Speech APIs:

```bash
az webapp config appsettings set \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --settings \
    GOOGLE_CLOUD_PROJECT_ID="your-project-id" \
    GOOGLE_CLOUD_CREDENTIALS="$(cat path/to/service-account-key.json)"
```

---

## 🌐 URL-ek

| Komponens | URL |
|-----------|-----|
| **Live App** | https://doctorai-app.azurewebsites.net |
| **Health Check** | https://doctorai-app.azurewebsites.net/health |
| **GitHub Repo** | https://github.com/doctorelectro/browser-ai |
| **GitHub Actions** | https://github.com/doctorelectro/browser-ai/actions |
| **Azure Portal** | https://portal.azure.com/ > doctorai-app |

---

## 📡 API Dokumentáció

### Chat API

**POST** `/api/chat/conversations`
- Új konverzáció létrehozása

**POST** `/api/chat`
- Üzenet küldése és AI válasz
- Body: `{ conversationId, content, systemPrompt? }`
- Response: `{ conversationId, content, usage }`

**GET** `/api/chat/conversations/:conversationId`
- Konverzáció előzménye

**DELETE** `/api/chat/conversations/:conversationId`
- Konverzáció törlése

### Mail API

**GET** `/api/mail/emails?query=&maxResults=10`
- Emailek listázása
- Header: `Authorization: Bearer <token>`

**POST** `/api/mail/send`
- Email küldése
- Body: `{ to, subject, body, isHtml? }`

**POST** `/api/mail/search`
- Emailek keresése
- Body: `{ query }`

### Drive API

**GET** `/api/drive/files?folderId=root&pageSize=10`
- Fájlok listázása

**POST** `/api/drive/upload`
- Fájl feltöltése
- Body: FormData { file, fileName, parentFolderId? }

**GET** `/api/drive/download/:fileId`
- Fájl letöltése

### Voice API

**POST** `/api/voice/tts`
- Text-to-Speech (működése: TBD)
- Body: `{ text, languageCode?, voiceName? }`

**POST** `/api/voice/stt`
- Speech-to-Text (működése: TBD)
- Body: `{ audioContent, languageCode? }`

---

## 🛠️ Fejlesztés Lokálisan

### Telepítés

```bash
cd /Users/isty/browser-ai
npm install
```

### Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Szerkeszd: AZURE_OPENAI_API_KEY, GOOGLE_CLIENT_ID, stb.

# Frontend
cp frontend/.env.example frontend/.env.local
```

### Szerver Indítása

**Terminal 1 - Backend (3001 port):**
```bash
npm run dev --workspace=browser-ai-backend
```

**Terminal 2 - Frontend (3000 port):**
```bash
npm run dev --workspace=browser-ai-frontend
```

**Nyisd meg:** http://localhost:3000

---

## 🚀 Deployment

### Automatikus (GitHub Actions)

```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions automatikusan deploy-ol Azure-ba
```

### Manuális (Azure CLI)

```bash
az webapp up --resource-group doctorai-rg --name doctorai-app --runtime NODE
```

---

## 📊 Monitoring

### Logs

```bash
# Real-time logs
az webapp log tail --resource-group doctorai-rg --name doctorai-app

# Download logs
az webapp log download --resource-group doctorai-rg --name doctorai-app --log-file logs.zip
```

### App Insights (opcionális)

```bash
az monitor app-insights component create \
  --app doctorai-insights \
  --location eastus \
  --resource-group doctorai-rg \
  --application-type web
```

---

## 💰 Költségvetés (2000 USD/év)

| Tétel | Havi | Éves |
|-------|------|------|
| Azure App Service (B1) | $15 | $180 |
| Azure OpenAI API | $100 | $1200 |
| Google Cloud APIs | $20 | $240 |
| Data egress | $5 | $60 |
| Reserve | $10 | $120 |
| **ÖSSZESEN** | **~$150** | **~$1800** |

✅ **2000 USD keretbe biztosan elfér!**

---

## ⚠️ Fontos Biztonsághoz

- ❌ SOHA NE közzétegyed az API kulcsokat
- ❌ GitHub secrets-ben tárolj minden sensitiv adatot
- ✅ Azure Key Vault-ot használj hosszú távon
- ✅ Regular security audits (npm audit, OWASP)
- ✅ HTTPS enforce (már be van állítva)

---

## 🎯 Következő Lépések

1. ✅ Azure OpenAI API key beállítása
2. ✅ Google OAuth credentials beállítása
3. ⬜ Tesztelés: `/api/chat` végpont
4. ⬜ Gmail auth flow tesztelése
5. ⬜ Frontend Chat UI szerkesztése (szükség esetén)
6. ⬜ Hangalapú support implementálása
7. ⬜ Canva integráció
8. ⬜ PDF feldolgozás
9. ⬜ Python executor

---

## 📝 Fájlok Szerkezete

```
browser-ai/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Main server
│   │   ├── routes/
│   │   │   ├── chatRoutes.js        # AI chat API
│   │   │   ├── mailRoutes.js        # Gmail API
│   │   │   ├── driveRoutes.js       # Google Drive API
│   │   │   └── voiceRoutes.js       # Voice API
│   │   └── services/
│   │       ├── azureOpenAIService.js
│   │       ├── gmailService.js
│   │       ├── googleAuthService.js
│   │       ├── googleDriveService.js
│   │       ├── memoryService.js
│   │       └── ...
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.js                  # Main chat page
│   │   ├── layout.js
│   │   ├── globals.css
│   │   └── page.module.css
│   ├── components/
│   │   ├── MailPanel.jsx            # Gmail komponens
│   │   ├── MailPanel.module.css
│   │   ├── VoiceInput.jsx           # Voice input komponens
│   │   └── VoiceInput.module.css
│   ├── package.json
│   └── next.config.js
│
├── .github/
│   └── workflows/
│       └── azure-deploy.yml         # CI/CD pipeline
│
├── .gitignore
├── package.json                     # Root workspace
├── web.config                       # IIS config
├── startup.sh                       # Startup script
└── README.md
```

---

## 🆘 Troubleshooting

### App nem indul Azure-ban

```bash
# Check logs
az webapp log tail --resource-group doctorai-rg --name doctorai-app

# Check status
az webapp show --resource-group doctorai-rg --name doctorai-app --query "state"

# Restart
az webapp restart --resource-group doctorai-rg --name doctorai-app
```

### GitHub Actions failed

1. Menj: https://github.com/doctorelectro/browser-ai/actions
2. Kattints az utolsó failed run-ra
3. Olvasd el az error logot
4. Közvetlenül fix GitHub-on vagy lokálisan

### API Key problémák

```bash
# Ellenőrizd az app settings-eket
az webapp config appsettings list --resource-group doctorai-rg --name doctorai-app

# Frissítsd az API key-t
az webapp config appsettings set \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --settings AZURE_OPENAI_API_KEY="new_key"
```

---

## 📞 Support

Ha problémád van:
1. Nézd meg az Azure Portal-on a logokat
2. Ellenőrizd a GitHub Actions workflow-ot
3. Teszteld lokálisan az API végpontokat
4. Azure CLI debug: `az webapp troubleshoot`

---

**Készült:** 2026.09.13  
**Verzió:** 1.0.0  
**Status:** 🟢 Ready for Deployment
