# 🚀 Korrekte Fly.io Deployment-Schritte

## Problem gelöst: App muss zuerst erstellt werden

Der Fehler "app not found" tritt auf, weil die App noch nicht bei Fly.io existiert. Hier sind die korrigierten Schritte:

## ✅ Korrekte Reihenfolge

### 1. Fly.io CLI Setup (bereits erledigt)
```bash
# Bei Fly.io anmelden (falls noch nicht geschehen)
flyctl auth login
```

### 2. App erstellen und initial deployen
```bash
# In das Projektverzeichnis (bereits erledigt)
cd /Users/t1l4n0/Downloads/project

# App erstellen und konfigurieren
flyctl launch

# Während flyctl launch:
# - App name: Wähle einen Namen (z.B. "shopify-billing-app-t1l4n0")
# - Region: fra (Frankfurt) oder deine bevorzugte Region
# - Would you like to set up a Postgresql database? → NO
# - Would you like to set up an Upstash Redis database? → NO
# - Would you like to deploy now? → YES (für ersten Deploy)
```

### 3. NACH dem ersten Deploy: Volume erstellen
```bash
# Jetzt funktioniert das Volume-Kommando
flyctl volumes create data --size 1
```

### 4. Umgebungsvariablen setzen
```bash
# Temporäre Werte für ersten Test
flyctl secrets set SHOPIFY_API_KEY="temp_key"
flyctl secrets set SHOPIFY_API_SECRET="temp_secret"
flyctl secrets set SHOPIFY_APP_URL="https://$(flyctl info --json | jq -r '.Hostname')"
flyctl secrets set SESSION_SECRET="$(openssl rand -base64 32)"
flyctl secrets set NODE_ENV="production"
```

### 5. Finales Deployment mit Volume
```bash
# App erneut deployen mit Volume-Konfiguration
flyctl deploy
```

## 🔧 Alternative: Alles in einem Schritt

Falls du neu starten möchtest:

```bash
# Lösche die aktuelle fly.toml (falls vorhanden)
rm fly.toml

# Starte komplett neu
flyctl launch --copy-config --no-deploy

# Folge den Prompts und dann:
flyctl volumes create data --size 1
flyctl deploy
```

## 📋 Nach dem Deployment

### App-URL abrufen
```bash
# Deine App-URL anzeigen
flyctl info

# Status überprüfen
flyctl status

# Logs anzeigen
flyctl logs
```

### Shopify Partner Dashboard konfigurieren
Mit der App-URL von `flyctl info`:
- **App URL**: `https://deine-app-name.fly.dev`
- **Redirect URL**: `https://deine-app-name.fly.dev/auth/callback`

## 🚨 Wichtige Hinweise

1. **App-Name muss eindeutig sein** - falls "shopify-billing-app" vergeben ist, wähle einen anderen
2. **Volume wird erst nach App-Erstellung erstellt**
3. **Erste Deployment kann 2-3 Minuten dauern**
4. **Echte Shopify-Credentials später setzen**

## 🔄 Nächste Schritte

1. Führe `flyctl launch` aus
2. Warte auf ersten Deploy
3. Erstelle Volume mit `flyctl volumes create data --size 1`
4. Deploye erneut mit `flyctl deploy`
5. Konfiguriere Shopify Partner Dashboard

Die App wird dann unter deiner Fly.io URL verfügbar sein! 🚀