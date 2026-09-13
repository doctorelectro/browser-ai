# 🚀 Azure Deployment Útmutató

## 1️⃣ GitHub Repo Létrehozása

### Opció A: GitHub CLI-vel
```bash
# Belépés
gh auth login

# Repo létrehozás
gh repo create browser-ai --public --source=. --remote=origin --push
```

### Opció B: Manuálisan
1. Menj a https://github.com/new
2. Repo neve: `browser-ai`
3. Public vagy Private (javasolt: Public nonprofit)
4. Klónozd: `git clone https://github.com/YOUR_USERNAME/browser-ai.git`
5. Push: `git push -u origin main`

---

## 2️⃣ Azure Publish Profile Beszerzése

### A. Azure Portal-ból
1. Menj: https://portal.azure.com/
2. App Service > **doctorai-app**
3. **Get publish profile** (jobb felső sarok)
4. Fájl letöltődik: `doctorai-app.PublishSettings`

### B. Azure CLI-vel
```bash
az webapp deployment list-publishing-profiles \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --query "[0].publishUrl" \
  --output tsv
```

---

## 3️⃣ GitHub Secret Beállítása

1. Menj: `https://github.com/YOUR_USERNAME/browser-ai/settings/secrets/actions`
2. **New repository secret**
3. Név: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Érték: A `.PublishSettings` fájl tartalma (XML teljes szövege)
5. **Add secret**

---

## 4️⃣ Automatikus Deploy

Ezután minden push az `main` branch-re automatikusan deploy-olódik:

```bash
git add .
git commit -m "Add deployment configs"
git push origin main
```

A GitHub Actions automatikusan:
- ✅ Dependencies telepítése
- ✅ Frontend build
- ✅ Backend linting
- ✅ Deploy Azure-ba

---

## 5️⃣ Environment Variables Beállítása Azure-ban

```bash
# Backend .env értékek Azure-ban
az webapp config appsettings set \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --settings \
    AZURE_OPENAI_API_KEY="your_key" \
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
    GOOGLE_CLIENT_ID="your_id" \
    GOOGLE_CLIENT_SECRET="your_secret" \
    NODE_ENV="production" \
    PORT="8080"
```

---

## 6️⃣ Tesztelés

```bash
# Azure app státusza
az webapp show --resource-group doctorai-rg --name doctorai-app --query state

# Logs
az webapp log tail --resource-group doctorai-rg --name doctorai-app
```

**URL:** https://doctorai-app.azurewebsites.net

---

## 🔧 Troubleshooting

### App nem indul
```bash
az webapp log tail --resource-group doctorai-rg --name doctorai-app
```

### Environment variables hiányznak
```bash
az webapp config appsettings list \
  --resource-group doctorai-rg \
  --name doctorai-app
```

### Redeploy
```bash
az webapp deployment slot swap \
  --resource-group doctorai-rg \
  --name doctorai-app \
  --slot staging
```

---

## 📊 Monitoring

### Application Insights (opcionális, de ajánlott)
```bash
# Insights komponens létrehozása
az monitor app-insights component create \
  --app doctorai-insights \
  --location eastus \
  --resource-group doctorai-rg \
  --application-type web
```

---

## 💰 Költségvetés

| Tétel | Havi |
|-------|------|
| App Service B1 | ~$15 |
| Data egress | ~$5-10 |
| **Összesen** | **~$20-25** |

**2000 USD/év keretből: ✅ Elfér!**

---

## 🎯 Végzett Lépések

- ✅ Git repo inicializálása
- ✅ Azure Resource Group
- ✅ Azure App Service Plan (B1)
- ✅ Azure App Service (Node.js 22)
- ✅ GitHub Actions CI/CD pipeline fájl
- ✅ Startup script

## ⏭️ Következő Lépések

1. GitHub repo létrehozása
2. Publish profile letöltése
3. Secret beállítása GitHub-on
4. Push `main` branch-re
5. Automatikus deploy indul

**URL:** https://doctorai-app.azurewebsites.net
