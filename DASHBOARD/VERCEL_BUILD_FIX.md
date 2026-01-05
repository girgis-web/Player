# Digital Signage Dashboard - Deploy Fix

## Problema Vercel Build

Se vedi l'errore: "No Next.js version detected"

### Soluzione 1: Vercel.json

Ho aggiunto `vercel.json` che specifica esplicitamente:
- Framework: Next.js
- Build command
- Runtime Node.js 20

### Soluzione 2: Nuovo Commit

```bash
cd /app/dashboard

# Assicurati che package.json sia corretto
cat package.json | grep next
# Deve mostrare: "next": "16.1.1"

# Fai un nuovo commit
git add .
git commit -m "fix: Add vercel.json for proper build configuration"
git push origin main
```

### Soluzione 3: Vercel Dashboard

1. Vai su https://vercel.com/dashboard
2. Seleziona il progetto `signage-dashboard`
3. **Settings** → **General**
4. **Root Directory**: Assicurati sia `./` (vuoto o punto)
5. **Framework Preset**: Seleziona `Next.js`
6. **Build Command**: `npm run build`
7. **Install Command**: `npm install`
8. **Output Directory**: `.next`
9. **Node.js Version**: `20.x`
10. **Save**

### Soluzione 4: Redeploy

Se il problema persiste:

1. Vai su **Deployments**
2. Trova l'ultimo deployment
3. Click sui 3 puntini → **Redeploy**
4. Seleziona **Use existing Build Cache** = OFF
5. Click **Redeploy**

### Soluzione 5: Verifica Locale

```bash
cd /app/dashboard

# Rimuovi node_modules e lock file
rm -rf node_modules package-lock.json

# Reinstalla
npm install

# Test build locale
npm run build

# Se funziona locale, fai nuovo commit
git add package-lock.json
git commit -m "fix: Fresh npm install and lock file"
git push origin main
```

### Verifica Package.json

Il tuo `package.json` DEVE contenere:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    ...
  }
}
```

### Check Environment Variables su Vercel

Assicurati che queste variabili siano configurate:

```
NEXT_PUBLIC_SUPABASE_URL=https://etllfcxshlkmjblavssu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_JWT_SECRET=your-secret
```

Vercel → Settings → Environment Variables

### Logs Dettagliati

Per vedere cosa sta succedendo:

1. Vai su Vercel Dashboard
2. Deployments → Seleziona deployment fallito
3. **Build Logs** - Cerca errori specifici
4. **Function Logs** - Dopo il deploy

### Contatto Vercel Support

Se nulla funziona:
1. https://vercel.com/support
2. Invia i build logs
3. Menziona: "Next.js 16.1.1 not detected despite being in package.json"

---

## Quick Fix (Più Probabile)

```bash
cd /app/dashboard

# 1. Aggiungi vercel.json (già fatto)
git add vercel.json

# 2. Nuovo commit
git commit -m "fix: Add vercel.json for build configuration"

# 3. Push
git push origin main

# 4. Vai su Vercel, dovrebbe auto-deploy
# 5. Se non parte, vai su Deployments → Redeploy (no cache)
```

Questo dovrebbe risolvere! ✅