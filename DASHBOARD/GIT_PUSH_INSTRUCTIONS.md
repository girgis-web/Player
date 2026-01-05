# 🎛️ DIGITAL SIGNAGE DASHBOARD

## 📍 Questa è la cartella DASHBOARD separata

✅ Repository: https://github.com/faltas/signage-dashboard

---

## 🚀 Setup Git e Push su GitHub

```bash
# 1. Vai nella cartella DASHBOARD
cd /app/DASHBOARD

# 2. Inizializza git
git init

# 3. Aggiungi remote GitHub
git remote add origin https://github.com/faltas/signage-dashboard.git

# 4. Aggiungi tutti i file
git add .

# 5. Verifica cosa verrà committato (controlla che .env.local NON ci sia)
git status

# 6. Commit
git commit -m "feat: Professional dashboard v1.0.0 - Vercel ready

✅ API routes ready for Vercel deployment
✅ Complete pairing flow with QR code
✅ Multi-language support (IT/EN default IT)
✅ Modern glass-morphic UI design
✅ Responsive mobile/tablet/desktop
✅ Complete database schema (SQL included)
✅ Real-time display monitoring
✅ Video wall & LED wall support
✅ Professional documentation
✅ Production-ready"

# 7. Push su GitHub
git branch -M main
git push -u origin main

# 8. Tag version
git tag -a v1.0.0 -m "Release v1.0.0 - Professional Dashboard"
git push origin v1.0.0
```

---

## ✅ Checklist Pre-Push

```bash
# Verifica che .env.local NON sia incluso
git status | grep .env.local
# ✅ Non deve apparire nulla

# Verifica che .env.local.example SIA incluso
ls -la .env.local.example
# ✅ Deve esistere

# Test build
npm install
npm run build
# ✅ Deve completare senza errori
```

---

## 🌐 Deploy su Vercel

### Opzione 1: GitHub Integration (Consigliato)

1. Fai push su GitHub (comandi sopra)
2. Vai su https://vercel.com/new
3. Import dal repository GitHub `signage-dashboard`
4. Framework: Next.js (auto-detect)
5. Aggiungi Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://etllfcxshlkmjblavssu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   SUPABASE_JWT_SECRET=your-jwt-secret
   ```
6. Deploy ✅

### Opzione 2: Vercel CLI

```bash
cd /app/DASHBOARD
npm i -g vercel
vercel login
vercel
# Segui le istruzioni
```

---

## 📊 Struttura Files

```
DASHBOARD/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes per Vercel
│   ├── displays/          # Pagina displays
│   ├── playlists/         # Pagina playlists
│   ├── contents/          # Pagina contenuti
│   └── settings/          # Impostazioni
├── components/            # React components
├── lib/                   # Utilities
├── supabase/             # Database schema
│   └── schema.sql        # ⭐ DA ESEGUIRE SU SUPABASE
├── .env.local            # ⚠️ NON pushare (in .gitignore)
├── .env.local.example    # ✅ Template da pushare
├── package.json          # Dependencies
├── vercel.json           # Vercel config
└── README.md             # Questo file
```

---

## 🗄️ Setup Database

Dopo il deploy, esegui lo schema su Supabase:

1. Vai su https://supabase.com/dashboard
2. Seleziona progetto: `etllfcxshlkmjblavssu`
3. SQL Editor → New Query
4. Copia contenuto di `supabase/schema.sql`
5. Run query
6. ✅ Tutte le tabelle create!

---

## 🔗 Collega Player

Dopo il deploy, prendi l'URL Vercel (es: `https://signage-dashboard-abc123.vercel.app`)

E aggiornalo nel Player:
```json
// PLAYER/preload/env.json
{
  "BACKEND_URL": "https://signage-dashboard-abc123.vercel.app",
  "REGISTER_DISPLAY_TOKEN": "https://signage-dashboard-abc123.vercel.app/api/register-display",
  "DISPLAY_TOKEN": "https://signage-dashboard-abc123.vercel.app/api/display-token"
}
```

---

## 📚 Documentazione Completa

- `README.md` - Overview e setup
- `ALIGNMENT_PLAN.md` - Piano sviluppo
- `DASHBOARD_GITHUB_GUIDE.md` - Guida Git dettagliata
- `VERCEL_BUILD_FIX.md` - Troubleshooting Vercel

---

## ✅ Tutto Pronto!

Esegui i comandi sopra e la dashboard sarà:
- ✅ Su GitHub
- ✅ Deployata su Vercel
- ✅ Pronta per connettere i player

🚀 **Buon deploy!**