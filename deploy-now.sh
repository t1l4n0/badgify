#!/bin/bash

# Finales Deployment für shopify-billing-1751058813
# Mit korrekter Client ID: YOUR_SHOPIFY_API_KEY

set -e

echo "🚀 Finales Deployment für shopify-billing-1751058813"
echo "Client ID: YOUR_SHOPIFY_API_KEY"
echo "=================================================="

# Volume erstellen (falls nicht vorhanden)
echo "💾 Erstelle Volume..."
flyctl volumes create data --size 1 --app shopify-billing-1751058813 || echo "✅ Volume existiert bereits"

# Umgebungsvariablen mit echter Client ID setzen
echo "🔐 Setze Umgebungsvariablen..."
flyctl secrets set \
    SHOPIFY_API_KEY="YOUR_SHOPIFY_API_KEY" \
    SHOPIFY_APP_URL="https://shopify-billing-1751058813.fly.dev" \
    SESSION_SECRET="$(openssl rand -base64 32)" \
    NODE_ENV="production" \
    --app shopify-billing-1751058813

echo "⚠️  WICHTIG: Du musst noch das API Secret setzen!"
echo "Gehe zu deinem Shopify Partner Dashboard und kopiere das Client Secret"
echo "Dann führe aus:"
echo "flyctl secrets set SHOPIFY_API_SECRET=\"dein_client_secret\" --app shopify-billing-1751058813"

# App deployen
echo "🚀 Deploye App..."
flyctl deploy --app shopify-billing-1751058813

echo ""
echo "✅ Deployment abgeschlossen!"
echo "App URL: https://shopify-billing-1751058813.fly.dev"
echo ""
echo "🔧 Shopify Partner Dashboard URLs:"
echo "App URL: https://shopify-billing-1751058813.fly.dev"
echo "Redirect URL: https://shopify-billing-1751058813.fly.dev/auth/callback"