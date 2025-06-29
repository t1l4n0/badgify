#!/bin/bash

# Schnelles Deployment-Script für Fly.io
# Führe dieses Script aus: bash quick-deploy.sh

set -e

echo "🚀 Shopify Billing App - Fly.io Deployment"
echo "=========================================="

# Überprüfe ob flyctl installiert ist
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl ist nicht installiert."
    echo "Installiere es mit: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Überprüfe ob angemeldet
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Nicht bei Fly.io angemeldet."
    echo "Führe aus: flyctl auth login"
    exit 1
fi

echo "✅ Fly.io CLI ist bereit"

# Schritt 1: App erstellen
echo ""
echo "📦 Schritt 1: App erstellen und initial deployen..."
echo "Folge den Prompts:"
echo "- App name: Wähle einen eindeutigen Namen"
echo "- Region: fra (empfohlen)"
echo "- PostgreSQL database: NO"
echo "- Redis database: NO"
echo "- Deploy now: YES"
echo ""

flyctl launch

# Schritt 2: Volume erstellen
echo ""
echo "💾 Schritt 2: Volume für Datenbank erstellen..."
flyctl volumes create data --size 1

# Schritt 3: Temporäre Secrets setzen
echo ""
echo "🔐 Schritt 3: Temporäre Umgebungsvariablen setzen..."

# App-Hostname abrufen
APP_HOSTNAME=$(flyctl info --json | jq -r '.Hostname' 2>/dev/null || echo "unknown")

flyctl secrets set \
    SHOPIFY_API_KEY="temp_key_replace_later" \
    SHOPIFY_API_SECRET="temp_secret_replace_later" \
    SHOPIFY_APP_URL="https://$APP_HOSTNAME" \
    SESSION_SECRET="$(openssl rand -base64 32)" \
    NODE_ENV="production"

# Schritt 4: Finales Deployment
echo ""
echo "🚀 Schritt 4: Finales Deployment..."
flyctl deploy

# Ergebnis anzeigen
echo ""
echo "✅ Deployment erfolgreich!"
echo "=========================="
echo "App URL: https://$APP_HOSTNAME"
echo ""
echo "🔧 Nächste Schritte:"
echo "1. Gehe zu https://partners.shopify.com/"
echo "2. Erstelle eine neue App"
echo "3. Setze App URL: https://$APP_HOSTNAME"
echo "4. Setze Redirect URL: https://$APP_HOSTNAME/auth/callback"
echo "5. Kopiere API Key und Secret"
echo "6. Setze echte Credentials:"
echo "   flyctl secrets set SHOPIFY_API_KEY=\"dein_api_key\""
echo "   flyctl secrets set SHOPIFY_API_SECRET=\"dein_api_secret\""
echo "7. Deploye erneut: flyctl deploy"
echo ""
echo "📊 Status überprüfen: flyctl status"
echo "📝 Logs anzeigen: flyctl logs"