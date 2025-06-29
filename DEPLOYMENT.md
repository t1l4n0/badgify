# Deployment-Anleitung für Shopify Billing App

## Übersicht

Diese Shopify App wurde erfolgreich erstellt und ist bereit für das Deployment. Die App implementiert:

- ✅ Shopify OAuth Authentifizierung
- ✅ Billing API Integration mit $9.99/Monat Subscription
- ✅ 3-Tage kostenlose Testphase
- ✅ Standard Shopify Admin-Oberfläche mit Polaris
- ✅ Webhook-Handler für App-Deinstallation
- ✅ TypeScript + Remix Framework
- ✅ Prisma ORM mit SQLite Datenbank

## Nächste Schritte

### 1. Shopify Partner Dashboard Setup

1. **App erstellen:**
   - Gehe zu [Shopify Partner Dashboard](https://partners.shopify.com/)
   - Erstelle eine neue App
   - Notiere dir API Key und API Secret

2. **App-URLs konfigurieren:**
   - App URL: `https://your-domain.com`
   - Allowed redirection URL: `https://your-domain.com/auth/callback`

3. **Billing-Plan erstellen:**
   - Name: "Basic Plan"
   - Preis: $9.99 USD
   - Intervall: Monatlich (30 Tage)
   - Trial: 3 Tage

### 2. Umgebungsvariablen

Erstelle eine `.env` Datei mit folgenden Werten:

```env
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SCOPES=read_products
SHOPIFY_APP_URL=https://your-deployed-app-url.com
DATABASE_URL="file:./dev.db"
SESSION_SECRET=your_random_session_secret_here
```

### 3. Deployment auf Fly.io

```bash
# 1. Fly.io CLI installieren
curl -L https://fly.io/install.sh | sh

# 2. In App-Verzeichnis wechseln
cd shopify-billing-app

# 3. Fly.io App initialisieren
fly launch

# 4. Umgebungsvariablen setzen
fly secrets set SHOPIFY_API_KEY=your_api_key
fly secrets set SHOPIFY_API_SECRET=your_api_secret
fly secrets set SHOPIFY_APP_URL=https://your-app.fly.dev
fly secrets set SESSION_SECRET=your_session_secret

# 5. App deployen
fly deploy
```

### 4. Datenbank initialisieren

Nach dem ersten Deployment:

```bash
# Prisma Schema zur Datenbank pushen
fly ssh console
npx prisma db push
exit
```

### 5. App testen

1. Installiere die App in einem Shopify Development Store
2. Teste die Subscription-Funktionalität
3. Überprüfe die Webhook-Integration

## Wichtige Hinweise

### Produktions-Einstellungen

Vor dem Live-Gang:

1. **Billing API:** Ändere `isTest: true` zu `isTest: false` in `app/routes/app.billing.tsx`
2. **Scopes:** Überprüfe und minimiere die erforderlichen Scopes
3. **Error Handling:** Implementiere umfassendes Error Logging
4. **Security:** Überprüfe alle Sicherheitseinstellungen

### Monitoring

- Überwache Logs mit `fly logs`
- Setze Alerts für kritische Fehler
- Überwache Subscription-Metriken

### Support

- Dokumentiere häufige Probleme
- Erstelle Support-Kanäle für Merchants
- Implementiere Health-Checks

## Troubleshooting

### Häufige Probleme

1. **OAuth-Fehler:** Überprüfe App-URLs im Partner Dashboard
2. **Billing-Fehler:** Stelle sicher, dass der Billing-Plan korrekt konfiguriert ist
3. **Webhook-Probleme:** Überprüfe die Webhook-URLs und SSL-Zertifikate

### Logs überprüfen

```bash
# Fly.io Logs
fly logs

# Lokale Entwicklung
npm run dev
```

Die App ist jetzt bereit für das Deployment und die Verwendung in Shopify Stores!

