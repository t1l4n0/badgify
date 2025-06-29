#!/bin/bash

# Script zum Beheben der Datenbank-Probleme
set -e

echo "🔧 Behebe Prisma Datenbank-Probleme..."

# 1. Datenbank-URL korrekt setzen
flyctl secrets set DATABASE_URL="file:/data/prod.db" --app shopify-billing-1751058813

# 2. Prisma Schema forciert pushen
echo "📊 Setze Prisma Schema..."
flyctl ssh console --app shopify-billing-1751058813 -C "cd /app && npx prisma db push --force-reset"

# 3. Prisma Client regenerieren
echo "🔄 Regeneriere Prisma Client..."
flyctl ssh console --app shopify-billing-1751058813 -C "cd /app && npx prisma generate"

# 4. App neu starten
echo "🚀 Starte App neu..."
flyctl apps restart shopify-billing-1751058813

echo "✅ Datenbank-Fix abgeschlossen!"