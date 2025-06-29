#!/bin/bash

# Deployment-Script für bestehende Fly.io App
# Für App: shopify-billing-1751058813

set -e

echo "🚀 Deploying zu bestehender Fly.io App: shopify-billing-1751058813"
echo "================================================================"

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

# App-Kontext setzen
echo "📱 Setze App-Kontext..."
flyctl apps list | grep shopify-billing-1751058813 || {
    echo "❌ App shopify-billing-1751058813 nicht gefunden in deinem Account"
    echo "Stelle sicher, dass du Zugriff auf diese App hast"
    exit 1
}

# Volume erstellen (falls nicht vorhanden)
echo "💾 Erstelle Volume für Datenbank (falls nicht vorhanden)..."
flyctl volumes create data --size 1 --app shopify-billing-1751058813 || echo "Volume existiert bereits"

# Umgebungsvariablen setzen
echo "🔐 Setze Umgebungsvariablen..."

# App-URL
APP_URL="https://shopify-billing-1751058813.fly.dev"

echo "App URL: $APP_URL"

# Temporäre Secrets setzen (falls noch nicht gesetzt)
flyctl secrets set \
    SHOPIFY_API_KEY="temp_key_replace_with_real" \
    SHOPIFY_API_SECRET="temp_secret_replace_with_real" \
    SHOPIFY_APP_URL="$APP_URL" \
    SESSION_SECRET="$(openssl rand -base64 32)" \
    NODE_ENV="production" \
    --app shopify-billing-1751058813

# App deployen
echo "🚀 Deploye App..."
flyctl deploy --app shopify-billing-1751058813

# Status überprüfen
echo ""
echo "✅ Deployment abgeschlossen!"
echo "=========================="
echo "App URL: $APP_URL"
echo "Status:"
flyctl status --app shopify-billing-1751058813

echo ""
echo "🔧 Nächste Schritte:"
echo "1. Gehe zu https://partners.shopify.com/"
echo "2. Erstelle eine neue App oder bearbeite bestehende"
echo "3. Setze App URL: $APP_URL"
echo "4. Setze Redirect URL: $APP_URL/auth/callback"
echo "5. Kopiere API Key und Secret aus dem Partner Dashboard"
echo "6. Setze echte Credentials:"
echo "   flyctl secrets set SHOPIFY_API_KEY=\"dein_echter_api_key\" --app shopify-billing-1751058813"
echo "   flyctl secrets set SHOPIFY_API_SECRET=\"dein_echter_api_secret\" --app shopify-billing-1751058813"
echo "7. Deploye erneut: flyctl deploy --app shopify-billing-1751058813"
echo ""
echo "📊 Status überprüfen: flyctl status --app shopify-billing-1751058813"
echo "📝 Logs anzeigen: flyctl logs --app shopify-billing-1751058813"