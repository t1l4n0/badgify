# 🚀 Fly.io Deployment Guide

## Voraussetzungen

1. **Fly.io Account erstellen**: https://fly.io/app/sign-up
2. **Fly.io CLI installieren**:
   ```bash
   # macOS
   brew install flyctl
   
   # Linux/WSL
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

## 🔧 Deployment-Schritte

### 1. Fly.io CLI einrichten
```bash
# Bei Fly.io anmelden
flyctl auth login

# In das Projektverzeichnis wechseln
cd shopify-billing-app
```

### 2. App erstellen und deployen
```bash
# App erstellen (folge den Prompts)
flyctl launch

# Wähle folgende Optionen:
# - App name: shopify-billing-app (oder dein gewünschter Name)
# - Region: fra (Frankfurt) oder deine bevorzugte Region
# - Would you like to set up a Postgresql database? NO
# - Would you like to set up an Upstash Redis database? NO
# - Would you like to deploy now? YES
```

### 3. Volume für Datenbank erstellen
```bash
# Persistentes Volume für SQLite-Datenbank
flyctl volumes create data --size 1
```

### 4. Umgebungsvariablen setzen
```bash
# Shopify API Credentials (ersetze mit echten Werten)
flyctl secrets set SHOPIFY_API_KEY="your_shopify_api_key_here"
flyctl secrets set SHOPIFY_API_SECRET="your_shopify_api_secret_here"

# App URL (ersetze mit deiner Fly.io URL)
flyctl secrets set SHOPIFY_APP_URL="https://your-app-name.fly.dev"

# Session Secret (generiere einen sicheren Schlüssel)
flyctl secrets set SESSION_SECRET="$(openssl rand -base64 32)"

# Produktionsumgebung
flyctl secrets set NODE_ENV="production"
```

### 5. Finales Deployment
```bash
# App mit allen Konfigurationen deployen
flyctl deploy
```

### 6. Datenbank initialisieren
```bash
# SSH-Verbindung zur App
flyctl ssh console

# Prisma Schema zur Datenbank pushen
npx prisma db push

# SSH-Verbindung beenden
exit
```

## 📋 Shopify Partner Dashboard Setup

### 1. App erstellen
1. Gehe zu [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Klicke auf "Apps" → "Create app"
3. Wähle "Create app manually"
4. Gib einen App-Namen ein (z.B. "Badgify - Product Badge System")

### 2. App-URLs konfigurieren
Nach dem Deployment deine Fly.io URL verwenden:

- **App URL**: `https://your-app-name.fly.dev`
- **Allowed redirection URLs**: 
  - `https://your-app-name.fly.dev/auth/callback`
  - `https://your-app-name.fly.dev/auth/shopify/callback`

### 3. App-Scopes setzen
- `read_products`
- `write_products`

### 4. API-Credentials abrufen
1. Gehe zu "App setup" → "App credentials"
2. Kopiere **Client ID** (API Key) und **Client secret** (API Secret)
3. Setze diese in Fly.io:
   ```bash
   flyctl secrets set SHOPIFY_API_KEY="deine_client_id"
   flyctl secrets set SHOPIFY_API_SECRET="dein_client_secret"
   ```

### 5. Webhooks konfigurieren
- **App uninstalled**: `https://your-app-name.fly.dev/webhooks/app/uninstalled`
- **Customer data request**: `https://your-app-name.fly.dev/webhooks/customers/data_request`
- **Customer redact**: `https://your-app-name.fly.dev/webhooks/customers/redact`
- **Shop redact**: `https://your-app-name.fly.dev/webhooks/shop/redact`

## 💳 Billing-Plan erstellen

### 1. Pricing-Plan einrichten
1. Gehe zu "App pricing" im Partner Dashboard
2. Klicke auf "Create pricing plan"
3. Konfiguriere:
   - **Plan name**: "Basic Plan"
   - **Price**: $9.99 USD
   - **Billing interval**: Every 30 days
   - **Trial period**: 3 days
   - **Plan type**: Recurring application charge

## 🧪 App testen

### 1. Development Store erstellen
1. Gehe zu "Stores" im Partner Dashboard
2. Erstelle einen neuen Development Store
3. Installiere deine App im Store

### 2. Funktionen testen
- OAuth-Authentifizierung
- Billing-Flow (Trial starten)
- Badgify-Features
- Webhook-Funktionalität

## 📊 Monitoring & Logs

### Logs anzeigen
```bash
# Live-Logs anzeigen
flyctl logs

# Logs der letzten Stunde
flyctl logs --since=1h
```

### App-Status überprüfen
```bash
# App-Informationen
flyctl info

# App-Status
flyctl status
```

### Performance überwachen
```bash
# Metriken anzeigen
flyctl metrics

# SSH-Zugang für Debugging
flyctl ssh console
```

## 🔧 Troubleshooting

### Häufige Probleme

**1. Deployment-Fehler**
```bash
# Build-Logs überprüfen
flyctl logs --app your-app-name

# App neu deployen
flyctl deploy --force
```

**2. Datenbank-Probleme**
```bash
# SSH-Verbindung
flyctl ssh console

# Prisma Status überprüfen
npx prisma db push --force-reset

# Datenbank-Schema überprüfen
npx prisma studio
```

**3. Umgebungsvariablen-Probleme**
```bash
# Alle Secrets anzeigen
flyctl secrets list

# Secret aktualisieren
flyctl secrets set KEY="new_value"
```

**4. SSL/HTTPS-Probleme**
```bash
# Zertifikat-Status überprüfen
flyctl certs show your-app-name.fly.dev

# Zertifikat erneuern
flyctl certs create your-app-name.fly.dev
```

## 🚀 Produktions-Checkliste

### Vor dem Live-Gang

- [ ] **Echte API-Credentials** gesetzt
- [ ] **Billing-Plan** im Partner Dashboard erstellt
- [ ] **App-URLs** korrekt konfiguriert
- [ ] **Webhooks** getestet
- [ ] **SSL-Zertifikat** aktiv
- [ ] **Datenbank** initialisiert
- [ ] **Monitoring** eingerichtet

### Sicherheits-Checks

- [ ] **Umgebungsvariablen** sicher gesetzt
- [ ] **Session Secret** generiert
- [ ] **HTTPS** erzwungen
- [ ] **GDPR-Webhooks** funktionsfähig

## 📈 Skalierung

### Automatische Skalierung
```bash
# Auto-Scaling konfigurieren
flyctl scale count 2

# Speicher erhöhen
flyctl scale memory 512

# CPU erhöhen
flyctl scale vm shared-cpu-2x
```

### Backup-Strategie
```bash
# Volume-Snapshot erstellen
flyctl volumes snapshots create data

# Snapshots auflisten
flyctl volumes snapshots list
```

## 💰 Kosten-Übersicht

### Fly.io Kosten (ca.)
- **Shared CPU (256MB RAM)**: ~$1.94/Monat
- **Volume (1GB)**: ~$0.15/Monat
- **Bandwidth**: Erste 160GB kostenlos

### Shopify Kosten
- **App Store Gebühr**: 20% der Subscription-Einnahmen
- **Partner Dashboard**: Kostenlos

## 🎯 Nächste Schritte

1. **Deployment durchführen** mit den obigen Schritten
2. **Shopify Partner Dashboard** konfigurieren
3. **App testen** in Development Store
4. **App Store Listing** erstellen (optional)
5. **Marketing** und Launch vorbereiten

Die App ist jetzt bereit für das Deployment! 🚀