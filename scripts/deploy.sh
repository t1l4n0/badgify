#!/bin/bash

# Deployment-Script für Fly.io
# Führe dieses Script aus, um die App zu deployen

set -e

echo "🚀 Deploying Shopify Billing App to Fly.io..."

# Überprüfe ob flyctl installiert ist
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl ist nicht installiert. Installiere es zuerst:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Überprüfe ob angemeldet
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Nicht bei Fly.io angemeldet. Führe aus: flyctl auth login"
    exit 1
fi

# App erstellen falls sie nicht existiert
echo "📦 Erstelle App falls sie nicht existiert..."
flyctl launch --no-deploy --copy-config || true

# Volume erstellen falls es nicht existiert
echo "💾 Erstelle Volume für Datenbank..."
flyctl volumes create data --size 1 || echo "Volume existiert bereits"

# Umgebungsvariablen setzen (falls noch nicht gesetzt)
echo "🔧 Setze Umgebungsvariablen..."
echo "Bitte setze deine Shopify API-Credentials:"
echo "flyctl secrets set SHOPIFY_API_KEY=\"your_api_key\""
echo "flyctl secrets set SHOPIFY_API_SECRET=\"your_api_secret\""
echo "flyctl secrets set SHOPIFY_APP_URL=\"https://$(flyctl info --json | jq -r '.Hostname')\""
echo "flyctl secrets set SESSION_SECRET=\"$(openssl rand -base64 32)\""

# App deployen
echo "🚀 Deploye App..."
flyctl deploy

# Status überprüfen
echo "✅ Deployment abgeschlossen!"
echo "App URL: https://$(flyctl info --json | jq -r '.Hostname')"
echo "Status: $(flyctl status)"

echo ""
echo "🔧 Nächste Schritte:"
echo "1. Setze deine Shopify API-Credentials mit den obigen Befehlen"
echo "2. Konfiguriere dein Shopify Partner Dashboard"
echo "3. Teste die App in einem Development Store"