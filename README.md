# Badgify - Advanced Product Badge System for Shopify

Eine umfassende Shopify App für die Erstellung und Verwaltung von benutzerdefinierten Produkt-Badges mit erweiterten Design-Optionen und automatischen Zuweisungsstrategien.

## 🚀 Features

### 🎨 Advanced Badge Designer
- **8 Badge-Formen**: Rectangle, Circle, Pill, Ribbon, Burst, Tag, Eclipse, Custom SVG
- **Erweiterte Styling-Optionen**: Farben, Schriftarten, Schatten, Verläufe, Animationen
- **Custom CSS Support**: Vollständige Kontrolle über das Badge-Design
- **Real-time Preview**: Live-Vorschau während der Konfiguration
- **Responsive Design**: Badges passen sich automatisch an verschiedene Bildschirmgrößen an

### 🎯 Intelligente Zuweisungsstrategien
- **Manuelle Auswahl**: Direkte Produktauswahl
- **Collection-basiert**: Automatische Zuweisung basierend auf Kollektionen
- **Tag-basiert**: Zuweisung über Produkt-Tags
- **Automatische Regeln**: Basierend auf Produkttyp, Hersteller, etc.
- **Bulk-Operationen**: Mehrere Produkte gleichzeitig verwalten

### 📊 Badge Management & Analytics
- **Badge-Manager**: Übersichtliche Verwaltung aller Badges
- **Performance-Analytics**: Impressions, Klicks, Conversions
- **A/B Testing**: Verschiedene Badge-Designs testen
- **Template-Bibliothek**: Vorgefertigte Badge-Designs
- **Versionskontrolle**: Badge-Änderungen nachverfolgen

### 💳 Subscription & Billing
- **3-Tage kostenlose Testphase**: Vollzugriff ohne Verpflichtung
- **$9.99/Monat**: Einfaches monatliches Abonnement
- **Shopify Billing API**: Native Zahlungsabwicklung
- **Automatische Verlängerung**: Nahtlose Subscription-Verwaltung

## Tech Stack

- **Framework**: Remix + TypeScript
- **Database**: SQLite mit Prisma ORM
- **UI**: Shopify Polaris
- **Authentication**: Shopify App Bridge
- **Billing**: Shopify Billing API
- **Styling**: Advanced CSS + Custom SVG Support

## Projektstruktur

```
badgify-app/
├── app/
│   ├── components/
│   │   └── badgify/
│   │       ├── BadgeDesigner.tsx        # Erweiterte Badge-Design-Komponente
│   │       ├── BadgeManager.tsx         # Badge-Verwaltung mit Bulk-Operationen
│   │       ├── ProductAssignment.tsx    # Intelligente Produktzuweisung
│   │       ├── BadgePresets.tsx         # Template-Bibliothek
│   │       └── BadgeHistory.tsx         # Badge-Verlauf und Wiederverwendung
│   ├── routes/
│   │   ├── app.tsx                      # App Layout mit Navigation
│   │   ├── app._index.tsx               # Dashboard mit Badgify Integration
│   │   ├── app.billing.tsx              # Billing-Seite
│   │   ├── app.badgify.tsx              # Badgify Hauptseite
│   │   └── webhooks.*.tsx               # Webhook-Handler
│   ├── utils/
│   │   ├── billing.server.ts            # Billing-Logik
│   │   └── subscription-guard.server.ts # Subscription-Middleware
│   └── shopify.server.ts                # Shopify-Konfiguration
├── prisma/
│   └── schema.prisma                    # Erweiterte Datenbankschema
└── README.md
```

## Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

Bearbeite `.env`:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SCOPES=read_products,write_products
SHOPIFY_APP_URL=https://your-app-url.com

# Database
DATABASE_URL="file:./dev.db"

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### 3. Datenbank einrichten

```bash
# Prisma Client generieren
npm run db:generate

# Datenbank-Schema anwenden
npm run db:push
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

## 🎨 Badge Design Features

### Verfügbare Badge-Formen

1. **Rectangle** - Klassische rechteckige Badges
2. **Circle** - Runde Badges für kompakte Designs
3. **Pill** - Abgerundete Ecken für moderne Optik
4. **Ribbon** - Elegante Bänder-Optik
5. **Burst** - Stern-förmige Badges für Aufmerksamkeit
6. **Tag** - Preisschild-Stil für Angebote
7. **Eclipse** - Einzigartige geschwungene Form
8. **Custom SVG** - Vollständig anpassbare SVG-Designs

### Design-Optionen

- **Farben**: Hintergrund, Text, Rahmen mit Farbwähler
- **Typografie**: Schriftart, -größe, -gewicht, Ausrichtung
- **Dimensionen**: Breite, Höhe, Padding, Border-Radius
- **Erweitert**: Schatten, Verläufe, Animationen, Custom CSS
- **Position**: 5 vordefinierte Positionen auf Produktbildern
- **Z-Index**: Layering-Kontrolle für komplexe Designs

## 🎯 Produktzuweisung

### Zuweisungsstrategien

#### 1. Manuelle Auswahl
- Direkte Produktauswahl über Suchfunktion
- Bulk-Operationen für mehrere Produkte
- Filterung nach Produkttyp, Hersteller, Tags

#### 2. Collection-basierte Zuweisung
- Automatische Zuweisung für alle Produkte in ausgewählten Kollektionen
- Dynamische Updates bei Kollektionsänderungen
- Multi-Collection-Support

#### 3. Tag-basierte Zuweisung
- Flexible Tag-Auswahl mit Autocomplete
- Kombinierbare Tags für komplexe Regeln
- Automatische Erkennung neuer Tags

#### 4. Automatische Regeln
- **Produkttyp-basiert**: Badges für spezifische Produktkategorien
- **Hersteller-basiert**: Vendor-spezifische Badges
- **Kombinierte Regeln**: Mehrere Kriterien gleichzeitig
- **Echtzeit-Updates**: Neue Produkte werden automatisch erfasst

## 📊 Analytics & Performance

### Verfügbare Metriken
- **Impressions**: Wie oft Badges angezeigt wurden
- **Klicks**: Interaktionen mit Badges
- **Conversions**: Käufe nach Badge-Interaktion
- **Performance-Vergleich**: A/B Testing verschiedener Designs

### Reporting
- **Dashboard-Übersicht**: Wichtigste KPIs auf einen Blick
- **Detailierte Berichte**: Pro Badge und Produkt
- **Zeitraum-Analyse**: Performance über Zeit
- **Export-Funktionen**: CSV/Excel Export für weitere Analyse

## 🛠️ API Endpoints

### Badge Management
- `POST /app/badgify` - Badge erstellen/bearbeiten
- `DELETE /app/badgify` - Badge löschen
- `PUT /app/badgify` - Badge-Status ändern

### Produktzuweisung
- `POST /app/badgify/assign` - Produkte zuweisen
- `GET /app/badgify/assignments` - Zuweisungen abrufen
- `DELETE /app/badgify/assignments` - Zuweisungen entfernen

### Analytics
- `GET /app/badgify/analytics` - Performance-Daten
- `GET /app/badgify/reports` - Detaillierte Berichte

## 🎨 Theme Integration

### Liquid Template Integration
```liquid
<!-- Badge-Anzeige in Produkttemplates -->
{% for badge in product.metafields.badgify.badges %}
  <div class="badgify-badge" 
       style="{{ badge.css_styles }}"
       data-badge-id="{{ badge.id }}">
    {{ badge.text }}
  </div>
{% endfor %}
```

### CSS-Klassen
```css
.badgify-badge {
  position: absolute;
  z-index: 10;
  pointer-events: none;
}

.badgify-badge.interactive {
  pointer-events: auto;
  cursor: pointer;
}
```

## 🔧 Erweiterte Konfiguration

### Custom CSS Beispiele
```css
/* Animierte Badges */
.pulse-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Gradient Backgrounds */
.gradient-badge {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}
```

### Custom SVG Shapes
```svg
<!-- Stern-förmiger Badge -->
<svg viewBox="0 0 24 24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
```

## 📱 Mobile Optimization

- **Responsive Design**: Badges passen sich automatisch an
- **Touch-Optimierung**: Größere Touch-Targets auf mobilen Geräten
- **Performance**: Optimierte Ladezeiten für mobile Verbindungen
- **Accessibility**: WCAG-konforme Badge-Implementierung

## 🔒 Sicherheit & Datenschutz

### Datenverarbeitung
- **Shop-spezifische Isolation**: Vollständige Mandantentrennung
- **GDPR-Compliance**: Automatische Datenlöschung bei App-Deinstallation
- **Sichere API-Calls**: Alle Shopify-Interaktionen über sichere Kanäle
- **Datenminimierung**: Nur notwendige Daten werden gespeichert

### Webhook-Handler
- **App Uninstalled**: Automatische Datenbereinigung
- **GDPR Webhooks**: Compliance mit Datenschutzbestimmungen
- **Product Updates**: Automatische Badge-Aktualisierung

## 🚀 Deployment

### Fly.io (Empfohlen)

```bash
# Fly.io CLI installieren
curl -L https://fly.io/install.sh | sh

# App initialisieren
fly launch

# Umgebungsvariablen setzen
fly secrets set SHOPIFY_API_KEY=your_api_key
fly secrets set SHOPIFY_API_SECRET=your_api_secret
fly secrets set SHOPIFY_APP_URL=https://your-app.fly.dev

# Deployen
fly deploy
```

### Shopify Partner Dashboard Setup

1. **App erstellen** im Partner Dashboard
2. **App-URLs konfigurieren**:
   - App URL: `https://your-app-url.com`
   - Redirect URL: `https://your-app-url.com/auth/callback`
3. **Scopes setzen**: `read_products,write_products`
4. **Billing-Plan erstellen**: $9.99/Monat mit 3-Tage Trial

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Badge Design Testing
- Visual Regression Tests für Badge-Rendering
- Cross-Browser Compatibility Tests
- Mobile Device Testing

## 📈 Performance Optimization

### Badge Rendering
- **CSS-basierte Badges**: Schnellere Ladezeiten als Bilder
- **Lazy Loading**: Badges werden nur bei Bedarf geladen
- **Caching**: Intelligente Cache-Strategien für Badge-Daten
- **CDN Integration**: Statische Assets über CDN

### Database Optimization
- **Indexierung**: Optimierte Datenbankindizes für schnelle Abfragen
- **Query Optimization**: Effiziente Datenbankabfragen
- **Connection Pooling**: Optimierte Datenbankverbindungen

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im Repository
- Kontaktiere den Entwickler
- Überprüfe die Dokumentation

---

**Powered by Shopify App Bridge, Remix, and Advanced CSS/SVG Technology** 🚀

## 🎯 Roadmap

### Version 2.0 (Geplant)
- [ ] **Theme Extension**: Native Shopify Theme Integration
- [ ] **Advanced Analytics**: Heatmaps und Conversion-Tracking
- [ ] **A/B Testing**: Integrierte Split-Testing-Funktionen
- [ ] **Badge Animations**: Erweiterte Animationsoptionen
- [ ] **Multi-Language**: Internationalisierung für globale Märkte
- [ ] **API Integration**: Externe Badge-Services Integration
- [ ] **Bulk Import/Export**: CSV-basierte Badge-Verwaltung
- [ ] **Advanced Targeting**: Kundengruppen-basierte Badge-Anzeige

### Version 2.1 (Geplant)
- [ ] **Machine Learning**: Automatische Badge-Optimierung
- [ ] **Real-time Collaboration**: Team-basierte Badge-Erstellung
- [ ] **Advanced Templates**: Community-Template-Marketplace
- [ ] **Performance Dashboard**: Erweiterte Performance-Metriken