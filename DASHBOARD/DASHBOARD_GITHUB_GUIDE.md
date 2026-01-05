# 🎛️ DASHBOARD - Digital Signage Management Dashboard

## 📍 Repository GitHub

**Nome suggerito**: `signage-dashboard` o `digital-signage-dashboard`

**Repository URL**: https://github.com/faltas/signage-dashboard

---

## 📁 Files da includere nel Dashboard Repository

### Struttura Dashboard (da `/app/dashboard/`):

```
signage-dashboard/
├── app/
│   ├── api/
│   │   ├── register-display/
│   │   │   └── route.js
│   │   ├── display-token/
│   │   │   └── route.js
│   │   └── pair-display/
│   │       └── route.js
│   ├── displays/
│   │   ├── page.jsx
│   │   ├── [id]/
│   │   │   ├── page.jsx
│   │   │   └── scheduling/
│   │   ├── add/
│   │   │   ├── page.jsx
│   │   │   ├── components/
│   │   │   └── services/
│   │   ├── components/
│   │   │   └── DisplayCard.jsx
│   │   └── hooks/
│   │       └── useDisplays.js
│   ├── playlists/
│   │   └── page.jsx
│   ├── contents/
│   │   └── page.jsx
│   ├── settings/
│   │   └── page.jsx
│   ├── login/
│   │   └── page.jsx
│   ├── layout.js
│   ├── page.jsx
│   ├── globals.css
│   ├── providers.jsx
│   └── language-provider.jsx
├── components/
│   ├── ui/ (tutti i componenti shadcn)
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── walls/
│   │   └── WallManager.jsx
│   ├── dashboard/
│   │   ├── DisplayGrid.jsx
│   │   ├── StatsHud.jsx
│   │   └── DisplayViewSwitcher.jsx
│   ├── media/
│   ├── playlist/
│   └── settings/
├── lib/
│   ├── supabaseClient.js
│   ├── supabaseAdmin.js
│   └── utils.ts
├── supabase/
│   └── schema.sql
├── public/
│   ├── icons/
│   └── images/
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.js
├── postcss.config.mjs
├── tsconfig.json
├── components.json
├── eslint.config.mjs
├── .env.local.example
├── .gitignore
├── README.md
├── ALIGNMENT_PLAN.md
└── vercel.json (opzionale)
```

---

## 🚀 Comandi per Push su GitHub

### Prima volta (nuovo repository):

```bash
cd /app/dashboard

# Inizializza git (se non già fatto)
git init

# Aggiungi remote
git remote add origin https://github.com/faltas/signage-dashboard.git

# Aggiungi tutti i file (esclusi quelli in .gitignore)
git add .

# Commit
git commit -m "feat: Professional dashboard with Vercel support - v1.0.0

- API routes ready for Vercel deployment
- Complete pairing flow
- Multi-language IT/EN support
- Modern glass-morphic UI
- Complete database schema
- Production-ready"

# Push
git branch -M main
git push -u origin main
```

### Aggiornamento repository esistente:

```bash
cd /app/dashboard

# Pull latest
git pull origin main

# Aggiungi modifiche
git add .

# Commit
git commit -m "fix: API routes for Vercel + pairing flow + i18n"

# Push
git push origin main
```

---

## 📝 .gitignore per Dashboard

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Build outputs
build/
dist/

# Environment variables
.env
.env*.local
!.env.local.example

# Vercel
.vercel

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Cache
.cache/
*.cache
.turbo/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Testing
coverage/

# Temporary
temp/
tmp/
```

---

## 🌐 Deploy su Vercel

### Via CLI:

```bash
cd /app/dashboard

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Segui le istruzioni interattive
```

### Via GitHub Integration:

1. Vai su https://vercel.com
2. **Import Project** → Seleziona repository GitHub
3. **Configure Project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables** (aggiungi queste):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://etllfcxshlkmjblavssu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   SUPABASE_JWT_SECRET=your-jwt-secret
   ```

5. **Deploy** ✅

---

## 📋 Checklist Pre-Push

- [ ] `.env.local` NON incluso nel commit
- [ ] `.env.local.example` incluso con placeholder
- [ ] `schema.sql` incluso per setup DB
- [ ] README aggiornato con istruzioni deploy
- [ ] Nessun file con credenziali reali
- [ ] `package.json` ha tutte le dipendenze
- [ ] Build funziona: `npm run build`
- [ ] .gitignore configurato correttamente

---

## 🗃️ Setup Database Post-Deploy

```bash
# 1. Vai su Supabase Dashboard
# 2. SQL Editor → New Query
# 3. Copia contenuto di supabase/schema.sql
# 4. Esegui query
# ✅ Tutte le tabelle create!
```

---

## 🏷️ Tag Version

```bash
# Crea tag per release
git tag -a v1.0.0 -m "Release v1.0.0 - Professional Dashboard"
git push origin v1.0.0
```

---

## 📦 Files da NON includere

❌ **NON includere nel Dashboard repo**:
- `/app/main/` (è del Player)
- `/app/preload/` (è del Player)
- `/app/renderer/` (è del Player)
- `/app/tests/` (test del Player)
- File `.env.local` con credenziali reali
- Cache o node_modules
- Build artifacts

---

## 🔗 Configurazione Player dopo Deploy

Dopo il deploy della Dashboard su Vercel, aggiorna il Player:

**File: `player/preload/env.json`**
```json
{
  "BACKEND_URL": "https://your-dashboard.vercel.app",
  "REGISTER_DISPLAY_TOKEN": "https://your-dashboard.vercel.app/api/register-display",
  "DISPLAY_TOKEN": "https://your-dashboard.vercel.app/api/display-token",
  "SUPABASE_LINK": "https://etllfcxshlkmjblavssu.supabase.co",
  "ANON_KEY": "eyJhbGci...",
  "HEARBEAT_MS": 30000
}
```

---

## ✅ Repository Pronto!

Una volta fatto il push, il repository Dashboard sarà:
- ✅ Completo e funzionante
- ✅ Pronto per Vercel
- ✅ API routes corrette
- ✅ Multi-language IT/EN
- ✅ UI professionale
- ✅ Database schema incluso
- ✅ Documentato
- ✅ Pronto per la produzione
