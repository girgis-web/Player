# 🎯 Digital Signage Dashboard

**Dashboard professionale per la gestione di display digitali, video wall e LED wall**

Versione: 1.0.0 | Stack: Next.js 16 + Supabase + Tailwind CSS

---

## ✅ Bug Risolti

### 1. **API Routes per Vercel**
- ❌ **Problema**: Le API erano in `/app/pages/api/` (Next.js 12 style)
- ✅ **Soluzione**: Spostate in `/app/api/` con route handlers Next.js 13+
- ✅ Aggiunto `export const runtime = "nodejs"`
- ✅ Aggiunto `export const dynamic = "force-dynamic"`
- ✅ Error handling completo su tutte le API

### 2. **Comunicazione Player ↔ Dashboard**
- ❌ **Problema**: Il player chiamava `/api/register-display` e `/api/display-token` ma mancavano validazioni
- ✅ **Soluzione**: 
  - Validazione completa di tutti i parametri
  - Verifica esistenza display nel database
  - Update automatico di `last_seen_at` e `status`
  - JWT token con expiry a 365 giorni (non 9999 anni)
  - Clock drift handling (-120 secondi)

### 3. **Pairing Flow**
- ❌ **Problema**: Non c'era un flusso completo di pairing
- ✅ **Soluzione**:
  - Creata API `/api/pair-display`
  - Dialog di pairing nella dashboard
  - Input per codice pairing
  - Validazione e associazione display → user
  - Rimozione automatica del pairing_code dopo associazione

### 4. **Sistema Lingue**
- ❌ **Problema**: Traduzioni incomplete, mancanza di chiavi
- ✅ **Soluzione**:
  - Dizionario completo italiano/inglese (200+ chiavi)
  - Default italiano con switch a inglese
  - Persistenza scelta in localStorage
  - Gestione hydration con `isClient`

### 5. **Grafica e UI/UX**
- ✅ Completamente rinnovata
- ✅ Glass-morphism design moderno
- ✅ Animazioni fluide
- ✅ Responsive completo mobile/tablet/desktop
- ✅ Dark mode nativo
- ✅ Componenti shadcn/ui professionali

---

## 🚀 Setup Completo

### 1. **Database Supabase**

```bash
# 1. Vai su https://supabase.com
# 2. Crea un nuovo progetto
# 3. Vai su SQL Editor
# 4. Copia il contenuto di supabase/schema.sql
# 5. Esegui lo script
```

**Tabelle create:**
- displays (display singoli)
- walls (video/LED walls)
- display_screens (monitor fisici)
- display_health (monitoring)
- contents (media files)
- playlists (playlist)
- playlist_items (contenuti in playlist)
- scenes (layout multi-regione)
- scene_regions (zone nelle scene)
- campaigns (scheduling)
- display_commands (controllo remoto)
- display_logs (activity logs)

### 2. **Configurazione Environment**

Crea `.env.local` nella root della dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://etllfcxshlkmjblavssu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-settings
```

**Come ottenere il JWT Secret:**
```
1. Vai su Supabase Dashboard
2. Settings → API
3. Copia il JWT Secret
```

### 3. **Installazione Dashboard**

```bash
cd dashboard
npm install
npm run dev
# Dashboard su http://localhost:3000
```

### 4. **Deploy su Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Aggiungi le env vars su Vercel Dashboard:
# Settings → Environment Variables
# Aggiungi tutte le variabili del .env.local
```

---

## 🔄 Flow Completo Player ↔ Dashboard

### Registrazione Display (Player Boot)

1. **Player avvia** e non ha `displayId` salvato
2. **Player chiama** `POST /api/register-display`
   ```json
   { "deviceInfo": {} }
   ```
3. **Dashboard crea** display nel database con `pairing_code` unico (es: "A3F9")
4. **Dashboard risponde** con:
   ```json
   {
     "displayId": "uuid",
     "pairing_code": "A3F9",
     "token": "jwt-token"
   }
   ```
5. **Player salva** `displayId` e mostra **Pairing Screen con QR code**

### Pairing (Dashboard)

6. **Utente** apre Dashboard → Displays → "Associa Display"
7. **Utente** inserisce codice `A3F9` (o scansiona QR)
8. **Dashboard chiama** `POST /api/pair-display`
   ```json
   {
     "pairing_code": "A3F9",
     "user_id": "user-uuid"
   }
   ```
9. **Dashboard associa** display all'utente
10. **Player viene associato** e può iniziare a ricevere comandi

### Autenticazione Successiva

11. **Player riavvia** con `displayId` salvato
12. **Player chiama** `POST /api/display-token`
    ```json
    { "displayId": "uuid" }
    ```
13. **Dashboard verifica** display esiste
14. **Dashboard aggiorna** `last_seen_at` e `status = "online"`
15. **Dashboard risponde** con nuovo JWT token
16. **Player usa token** per autenticare le chiamate Supabase

### Comunicazione Real-time

17. **Player si connette** a Supabase con JWT token
18. **Player ascolta** canali real-time:
    - `display:${displayId}` - Modifiche al display
    - `playlist:${playlistId}` - Modifiche playlist
    - `display_commands:${displayId}` - Comandi remoti
19. **Dashboard invia comandi** via tabella `display_commands`
20. **Player esegue** comandi e marca come executed

---

## 📡 API Endpoints

### `POST /api/register-display`
**Input:**
```json
{ "deviceInfo": { "hardware_id": "optional" } }
```

**Output:**
```json
{
  "displayId": "uuid",
  "pairing_code": "XXXX",
  "token": "jwt-token"
}
```

### `POST /api/display-token`
**Input:**
```json
{ "displayId": "uuid" }
```

**Output:**
```json
{ "token": "jwt-token" }
```

### `POST /api/pair-display`
**Input:**
```json
{
  "pairing_code": "XXXX",
  "user_id": "user-uuid"
}
```

**Output:**
```json
{
  "success": true,
  "display": {
    "id": "uuid",
    "name": "Display XXXX",
    "status": "online"
  }
}
```

---

## 🎨 Componenti UI

### Pagine Principali

1. **`/displays`** - Lista display con pairing
2. **`/displays/[id]`** - Dettaglio display e comandi
3. **`/playlists`** - Gestione playlist
4. **`/contents`** - Upload e gestione contenuti
5. **`/settings`** - Impostazioni sistema

### Componenti Chiave

- **`Sidebar`** - Navigazione con switch lingua IT/EN
- **`TopBar`** - Header con breadcrumbs
- **`DisplayGrid`** - Griglia display responsive
- **`StatsHud`** - Statistiche in tempo reale
- **`WallManager`** - Gestione video/LED walls

### Traduzioni

```jsx
import { useLanguage } from "@/app/language-provider";

function MyComponent() {
  const { t, lang, switchLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('overview')}</h1>
      <button onClick={() => switchLanguage('en')}>English</button>
    </div>
  );
}
```

---

## 🔧 Configurazione Player

Il player deve puntare alla dashboard su Vercel:

**File: `player/preload/env.json`**
```json
{
  "BACKEND_URL": "https://your-dashboard.vercel.app",
  "REGISTER_DISPLAY_TOKEN": "https://your-dashboard.vercel.app/api/register-display",
  "DISPLAY_TOKEN": "https://your-dashboard.vercel.app/api/display-token",
  "SUPABASE_LINK": "https://etllfcxshlkmjblavssu.supabase.co",
  "ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "HEARBEAT_MS": 30000
}
```

---

## 🐛 Debugging

### Player non si connette

```bash
# Check logs player
tail -f /var/log/supervisor/backend.*.log

# Verifica BACKEND_URL in env.json
# Verifica che la dashboard sia raggiungibile
curl https://your-dashboard.vercel.app/api/register-display
```

### Pairing non funziona

```bash
# Verifica nel database Supabase
SELECT * FROM displays WHERE pairing_code IS NOT NULL;

# Check API logs su Vercel
# Dashboard → Deployments → Functions → Logs
```

### Display offline

```sql
-- Check last_seen_at
SELECT id, name, status, last_seen_at 
FROM displays 
WHERE user_id = 'your-user-id';

-- Un display è considerato offline se:
-- NOW() - last_seen_at > 5 minuti
```

---

## 📊 Features Professionali

### ✅ Implementato
- Display management (single/multi)
- Pairing via QR code/manual
- Real-time status updates
- Health monitoring
- Playlist management
- Content upload
- Remote commands
- Multi-language (IT/EN)
- Responsive UI
- Dark mode
- Video wall support (DB ready)
- LED wall support (DB ready)

### 🔜 Da Completare
- Scene editor per video walls
- Campaign scheduler UI
- Advanced analytics
- User roles & permissions
- Screenshot capture
- Remote debugging console

---

## 🚀 Production Checklist

- [x] Database schema completo
- [x] API routes su Vercel
- [x] Error handling completo
- [x] Real-time updates
- [x] Pairing flow funzionante
- [x] Multi-language
- [x] Responsive design
- [x] Security (RLS policies)
- [ ] Analytics integration
- [ ] Monitoring & alerts
- [ ] Backup strategy
- [ ] Load testing

---

## 📞 Support

Per problemi o domande:
1. Check logs player: `/var/log/supervisor/`
2. Check logs Vercel: Dashboard → Deployments → Logs
3. Check database: Supabase → Table Editor
4. Verifica env vars: sia player che dashboard

---

**Built with ❤️ for professional digital signage**