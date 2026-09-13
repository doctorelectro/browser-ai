# 🚀 Backend - Browser AI

Node.js + Express backend API a Browser AI asszisztenshez.

## 📁 Struktúra

```
backend/
├── src/
│   ├── index.js                    # Main server
│   ├── services/
│   │   ├── googleAuthService.js    # Google OAuth
│   │   ├── gmailService.js         # Gmail API
│   │   ├── googleDriveService.js   # Google Drive API
│   │   ├── azureOpenAIService.js   # Azure OpenAI
│   │   └── memoryService.js        # Conversation memory
│   ├── routes/                     # API endpoints
│   ├── utils/                      # Helper functions
│   └── config/                     # Configuration
├── package.json
└── .env.example
```

## 🔧 Telepítés

```bash
npm install
cp .env.example .env
```

## 🔐 Konfigurálás

### Azure OpenAI

```env
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo
```

### Google APIs

```env
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

### Memory/Vector Database

**Opció A: Pinecone**
```env
PINECONE_API_KEY=your_key
PINECONE_INDEX_NAME=browser-ai
PINECONE_ENVIRONMENT=your_env
USE_WEAVIATE=false
```

**Opció B: Weaviate (lokális)**
```bash
docker run -d \
  -p 8080:8080 \
  --name weaviate \
  semitechnologies/weaviate:latest
```

```env
WEAVIATE_URL=http://localhost:8080
USE_WEAVIATE=true
```

## 🏃 Futtatás

### Development

```bash
npm run dev
```

Szerver fut: `http://localhost:3001`  
WebSocket: `ws://localhost:3001`

### Production

```bash
npm start
```

## 📡 API Endpoints (TBD)

| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| GET | `/health` | Server status |
| GET | `/api/auth/google` | Google OAuth URL |
| POST | `/api/auth/callback` | OAuth callback |
| GET | `/api/mail` | Get emails |
| POST | `/api/mail/send` | Send email |
| GET | `/api/drive` | List Drive files |
| POST | `/api/drive/upload` | Upload file |

## 🔌 WebSocket Messages

### User → Server
```json
{
  "type": "message",
  "content": "Olvasd el az utolsó emailt",
  "conversationId": "uuid"
}
```

### Server → User
```json
{
  "type": "response",
  "content": "Email tartalma...",
  "status": "complete"
}
```

## 🎯 Fejlesztési folyamat

1. ✅ Alaprendszer (WebSocket, logging)
2. ⬜ Gmail integráció
3. ⬜ Google Drive integráció
4. ⬜ Azure OpenAI integrálása
5. ⬜ Böngészés (Puppeteer/Selenium)
6. ⬜ Hangalapú (Google Cloud Speech)
7. ⬜ Python executor

## 📝 Logging

A `pino` logging library-t használjuk:

```bash
# Lokális logok
npm run dev
```

## 🧪 Tesztelés

```bash
# TBD - Unit és integration tesztek
```

## 💡 Hasznos parancsok

```bash
# Node verzió check
node --version

# Dependencies update
npm update

# Audit (biztonsági ellenőrzés)
npm audit
npm audit fix
```
