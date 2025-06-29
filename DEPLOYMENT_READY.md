# 🚀 Deployment-Ready Shopify Billing App

Die App ist **vollständig vorbereitet** für das Deployment bei Fly.io und anderen Hosting-Anbietern!

## ✅ Deployment-Vorbereitung abgeschlossen

### Was wurde vorbereitet:
- ✅ **Fly.io CLI installiert** und konfiguriert
- ✅ **fly.toml** Konfigurationsdatei erstellt
- ✅ **Dockerfile** für Container-Deployment optimiert
- ✅ **package.json** für Produktion konfiguriert
- ✅ **Umgebungsvariablen** vorbereitet
- ✅ **Datenbank-Setup** für persistente Speicherung

## 🔑 Nächste Schritte für Deployment

### Option 1: Fly.io (Empfohlen)

**1. Fly.io Account erstellen:**
```bash
# Besuche https://fly.io und erstelle einen kostenlosen Account
```

**2. Anmelden und deployen:**
```bash
cd shopify-billing-app
flyctl auth login
flyctl launch
```

**3. Umgebungsvariablen setzen:**
```bash
flyctl secrets set SHOPIFY_API_KEY=your_real_api_key
flyctl secrets set SHOPIFY_API_SECRET=your_real_api_secret
flyctl secrets set SHOPIFY_APP_URL=https://your-app.fly.dev
flyctl secrets set SESSION_SECRET=your_secure_session_secret
```

**4. Volume für Datenbank erstellen:**
```bash
flyctl volumes create shopify_billing_data --size 1
```

**5. App deployen:**
```bash
flyctl deploy
```

### Option 2: Railway (Alternative)

**1. Railway Account erstellen:**
- Besuche https://railway.app
- Verbinde dein GitHub Repository

**2. Umgebungsvariablen setzen:**
```env
SHOPIFY_API_KEY=your_real_api_key
SHOPIFY_API_SECRET=your_real_api_secret
SHOPIFY_APP_URL=https://your-app.railway.app
SESSION_SECRET=your_secure_session_secret
DATABASE_URL=file:/app/data/prod.db
PORT=8080
```

**3. Automatisches Deployment:**
- Railway deployt automatisch bei Git Push

### Option 3: Vercel (Serverless)

**1. Vercel Account erstellen:**
- Besuche https://vercel.com
- Verbinde dein GitHub Repository

**2. Vercel-Konfiguration:**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/build/index.js"
    }
  ]
}
```

## 🔧 Shopify Partner Dashboard Setup

### 1. App erstellen
1. Gehe zu [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Erstelle eine neue App
3. Wähle "Custom app" oder "Public app"

### 2. App-URLs konfigurieren
- **App URL:** `https://your-deployed-app-url.com`
- **Allowed redirection URL:** `https://your-deployed-app-url.com/auth/callback`

### 3. Webhooks konfigurieren
- **App uninstalled:** `https://your-deployed-app-url.com/webhooks/app/uninstalled`

### 4. Billing-Plan erstellen
1. Gehe zu "App pricing" im Partner Dashboard
2. Erstelle neuen Plan:
   - **Name:** "Basic Plan"
   - **Preis:** $9.99 USD
   - **Intervall:** Monatlich (30 Tage)
   - **Trial:** 3 Tage

## 📋 Benötigte Umgebungsvariablen

```env
# Von Shopify Partner Dashboard
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here

# App-Konfiguration
SCOPES=read_products
SHOPIFY_APP_URL=https://your-deployed-app-url.com

# Datenbank (automatisch konfiguriert)
DATABASE_URL=file:/data/prod.db

# Sicherheit (generiere einen sicheren Schlüssel)
SESSION_SECRET=your_secure_random_session_secret
```

## 🧪 Lokales Testen vor Deployment

```bash
# Dependencies installieren
npm install

# Prisma Client generieren
npx prisma generate

# Datenbank initialisieren
npx prisma db push

# Entwicklungsserver starten
npm run dev
```

## 🔍 Deployment-Verifikation

Nach dem Deployment überprüfe:

1. **App-URL erreichbar:** `https://your-app-url.com`
2. **OAuth funktioniert:** `/auth` Endpunkt
3. **Billing-Seite lädt:** `/app/billing`
4. **Webhooks empfangen:** Teste App-Installation/Deinstallation

## 🛠️ Troubleshooting

### Häufige Probleme:

**1. "Module not found" Fehler:**
```bash
npm install
npx prisma generate
npm run build
```

**2. Datenbank-Fehler:**
```bash
npx prisma db push
```

**3. OAuth-Fehler:**
- Überprüfe App-URLs im Partner Dashboard
- Stelle sicher, dass HTTPS verwendet wird

**4. Billing-Fehler:**
- Überprüfe Billing-Plan im Partner Dashboard
- Stelle sicher, dass `isTest: false` für Produktion

## 📊 Monitoring

### Logs überprüfen:
```bash
# Fly.io
flyctl logs

# Railway
railway logs

# Vercel
vercel logs
```

### Health-Check:
- App-Status: `GET /app`
- Datenbank: Subscription-Tabelle überprüfen

## 🎯 Nächste Schritte

1. **Wähle Hosting-Anbieter** (Fly.io empfohlen)
2. **Erstelle Account** beim gewählten Anbieter
3. **Deploye die App** mit den bereitgestellten Befehlen
4. **Konfiguriere Shopify Partner Dashboard**
5. **Teste die App** in einem Development Store
6. **Gehe live** nach erfolgreichem Test

Die App ist **100% deployment-ready** und kann sofort verwendet werden! 🚀

