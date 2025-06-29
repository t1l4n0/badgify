#!/bin/bash

# Script zum Setzen der Fly.io Secrets
# Führe dieses Script aus, nachdem du deine Shopify API-Credentials hast

set -e

echo "🔐 Setup Fly.io Secrets für Shopify Billing App"

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

# App-Hostname abrufen
APP_HOSTNAME=$(flyctl info --json | jq -r '.Hostname' 2>/dev/null || echo "your-app-name.fly.dev")

echo "App Hostname: $APP_HOSTNAME"
echo ""

# API Key abfragen
read -p "Shopify API Key (Client ID): " SHOPIFY_API_KEY
if [ -z "$SHOPIFY_API_KEY" ]; then
    echo "❌ API Key ist erforderlich"
    exit 1
fi

# API Secret abfragen
read -s -p "Shopify API Secret (Client Secret): " SHOPIFY_API_SECRET
echo ""
if [ -z "$SHOPIFY_API_SECRET" ]; then
    echo "❌ API Secret ist erforderlich"
    exit 1
fi

# Session Secret generieren
SESSION_SECRET=$(openssl rand -base64 32)

echo ""
echo "🔧 Setze Secrets..."

# Secrets setzen
flyctl secrets set \
    SHOPIFY_API_KEY="$SHOPIFY_API_KEY" \
    SHOPIFY_API_SECRET="$SHOPIFY_API_SECRET" \
    SHOPIFY_APP_URL="https://$APP_HOSTNAME" \
    SESSION_SECRET="$SESSION_SECRET" \
    NODE_ENV="production"

echo ""
echo "✅ Secrets erfolgreich gesetzt!"
echo ""
echo "🔧 Shopify Partner Dashboard Konfiguration:"
echo "App URL: https://$APP_HOSTNAME"
echo "Redirect URL: https://$APP_HOSTNAME/auth/callback"
echo "Webhook URLs:"
echo "  - App uninstalled: https://$APP_HOSTNAME/webhooks/app/uninstalled"
echo "  - Customer data request: https://$APP_HOSTNAME/webhooks/customers/data_request"
echo "  - Customer redact: https://$APP_HOSTNAME/webhooks/customers/redact"
echo "  - Shop redact: https://$APP_HOSTNAME/webhooks/shop/redact"
echo ""
echo "🚀 Deploye die App erneut: flyctl deploy"