# 🚀 Finales Deployment für shopify-billing-1751058813

## ✅ App bereits erstellt

Deine App `shopify-billing-1751058813` ist bereits bei Fly.io erstellt. Hier sind die finalen Schritte:

## 📋 Deployment-Befehle

### 1. Volume erstellen
```bash
flyctl volumes create data --size 1 --app shopify-billing-1751058813
```

### 2. Umgebungsvariablen setzen
```bash
# Temporäre Werte (später durch echte ersetzen)
flyctl secrets set \
    SHOPIFY_API_KEY="temp_key_replace_with_real" \
    SHOPIFY_API_SECRET="temp_secret_replace_with_real" \
    SHOPIFY_APP_URL="https://shopify-billing-1751058813.fly.dev" \
    SESSION_SECRET="$(openssl rand -base64 32)" \
    NODE_ENV="production" \
    --app shopify-billing-1751058813
```

### 3. App deployen
```bash
flyctl deploy --app shopify-billing-1751058813
```

## 🔧 Shopify Partner Dashboard Setup

### App-URLs für Partner Dashboard:
- **App URL**: `https://shopify-billing-1751058813.fly.dev`
- **Redirect URL**: `https://shopify-billing-1751058813.fly.dev/auth/callback`

### Webhook-URLs:
- **App uninstalled**: `https://shopify-billing-1751058813.fly.dev/webhooks/app/uninstalled`
- **Customer data request**: `https://shopify-billing-1751058813.fly.dev/webhooks/customers/data_request`
- **Customer redact**: `https://shopify-billing-1751058813.fly.dev/webhooks/customers/redact`
- **Shop redact**: `https://shopify-billing-1751058813.fly.dev/webhooks/shop/redact`

## 🔑 Echte API-Credentials setzen

Nach dem Erstellen der App im Partner Dashboard:

```bash
# Ersetze mit echten Werten aus dem Partner Dashboard
flyctl secrets set \
    SHOPIFY_API_KEY="dein_echter_api_key" \
    SHOPIFY_API_SECRET="dein_echter_api_secret" \
    --app shopify-billing-1751058813

# Erneut deployen
flyctl deploy --app shopify-billing-1751058813
```

## 📊 Status überprüfen

```bash
# App-Status
flyctl status --app shopify-billing-1751058813

# Logs anzeigen
flyctl logs --app shopify-billing-1751058813

# App-Informationen
flyctl info --app shopify-billing-1751058813
```

## 🎯 Schnell-Deployment

Führe das bereitgestellte Script aus:

```bash
bash scripts/deploy-existing-app.sh
```

## ✅ Checkliste

- [ ] Volume erstellt
- [ ] Umgebungsvariablen gesetzt
- [ ] App deployed
- [ ] Shopify Partner Dashboard konfiguriert
- [ ] Echte API-Credentials gesetzt
- [ ] App getestet

Die App wird unter `https://shopify-billing-1751058813.fly.dev` verfügbar sein! 🚀