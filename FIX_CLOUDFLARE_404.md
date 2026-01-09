# 🔧 Fix Cloudflare Pages 404 Error

## Masalah
Setelah connect GitHub dan deploy berhasil, tapi akses ke `https://wedison-hanindo.pages.dev` mendapatkan error 404.

## Penyebab
Build settings di Cloudflare Pages Dashboard kemungkinan salah. Cloudflare Pages perlu:
1. **Build command**: `npm run pages:build` (bukan `npm run build`)
2. **Build output directory**: `.vercel/output/static` (bukan `.next`)
3. **Node version**: 20.x (recommended)

## ✅ Solusi

### Langkah 1: Update Build Settings di Cloudflare Dashboard

1. **Login ke Cloudflare Dashboard**
   - Buka [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pilih "Pages" dari sidebar

2. **Buka Project Settings**
   - Klik project `wedison-hanindo`
   - Klik tab **"Settings"**
   - Scroll ke **"Builds & deployments"**

3. **Update Build Configuration:**
   ```
   Framework preset: Next.js (auto-detect)
   Build command: npm run pages:build
   Build output directory: .vercel/output/static
   Root directory: (kosongkan - leave empty)
   Node version: 20 (atau 18)
   ```

4. **Environment Variables** (jika perlu):
   - Scroll ke **"Environment variables"**
   - Add variables jika diperlukan:
     - `NEXT_PUBLIC_GTM_ID` (jika menggunakan GTM)
     - `NEXT_PUBLIC_GA4_ID` (jika menggunakan GA4)
     - dll.

5. **Save dan Trigger New Deployment**
   - Klik **"Save"**
   - Klik **"Retry deployment"** atau **"Retry build"** pada deployment yang gagal
   - Atau trigger deployment baru dengan push baru ke GitHub

### Langkah 2: Verify Build Output Locally

Test build lokal untuk memastikan output directory benar:

```bash
# Build untuk Cloudflare Pages
npm run pages:build

# Verify output directory exists
ls -la .vercel/output/static

# Check jika ada index.html atau file static
ls -la .vercel/output/static/ | head -20
```

Output seharusnya ada:
- `index.html` atau `index.rsc`
- `_worker.js/` directory
- Static assets (CSS, JS, images)

### Langkah 3: Check Build Logs di Cloudflare

1. **Di Cloudflare Pages Dashboard**
   - Go to project `wedison-hanindo`
   - Klik tab **"Deployments"**
   - Klik deployment terakhir
   - Scroll ke **"Build Logs"**

2. **Cari Error:**
   - Jika build gagal, akan ada error merah
   - Jika build sukses tapi 404, kemungkinan output directory salah

3. **Common Errors:**
   - `Error: No output directory found` → Build output directory salah
   - `Error: Build command failed` → Build command salah atau dependency missing
   - `Error: Cannot find module` → Dependencies tidak terinstall

### Langkah 4: Alternative - Deploy via Wrangler CLI

Jika dashboard tidak berfungsi, deploy via CLI:

```bash
# Login ke Cloudflare
npx wrangler login

# Build dan Deploy
npm run pages:deploy
```

Ini akan langsung deploy tanpa melalui GitHub.

## 📋 Checklist Settings yang Benar

Di Cloudflare Pages Dashboard → Settings → Builds & deployments:

- [ ] **Build command**: `npm run pages:build`
- [ ] **Build output directory**: `.vercel/output/static`
- [ ] **Root directory**: (kosong - tidak perlu diisi)
- [ ] **Node version**: 20 atau 18
- [ ] **Framework preset**: Next.js (auto-detect, bisa juga manual)

## 🔍 Troubleshooting

### Build Sukses Tapi Masih 404

1. **Check Output Directory:**
   ```bash
   # After build locally
   ls -la .vercel/output/static/
   ```
   
   Pastikan ada file seperti:
   - `index.html` atau `index.rsc`
   - `_worker.js/` folder
   - Static files

2. **Check Cloudflare Build Logs:**
   - Build harus complete dengan status "Success"
   - Tidak ada error di akhir build log

3. **Verify Deployment:**
   - Di Cloudflare Pages → Deployments
   - Deployment status harus "Active" (hijau)
   - Tidak ada error status

### Build Command Error

Jika build command error:

1. **Check dependencies:**
   - Pastikan `@cloudflare/next-on-pages` terinstall
   - Pastikan `package.json` memiliki script `pages:build`

2. **Check Node version:**
   - Use Node 18.x or 20.x
   - Cloudflare Pages default mungkin Node 16 (tidak support)

3. **Add NODE_VERSION environment variable:**
   - Di Cloudflare Pages → Settings → Environment variables
   - Add: `NODE_VERSION` = `20`

### Output Directory Tidak Ditemukan

Jika error "No output directory found":

1. **Verify build command:**
   - Harus `npm run pages:build` (bukan `npm run build`)
   - Script `pages:build` akan create `.vercel/output/static`

2. **Check .gitignore:**
   - Pastikan `.vercel` tidak di-gitignore (atau boleh di-gitignore, Cloudflare akan build sendiri)

3. **Manually verify:**
   ```bash
   npm run pages:build
   ls -la .vercel/output/static/
   ```

## 🚀 Quick Fix (Recommended)

**Update Settings di Cloudflare Pages Dashboard:**

1. Go to: https://dash.cloudflare.com → Pages → wedison-hanindo → Settings
2. Scroll ke "Builds & deployments"
3. Update:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
   - Root directory: (kosong)
   - Node version: 20
4. Save
5. Go to Deployments tab
6. Click "Retry deployment" pada deployment terakhir

## ✅ Verification

Setelah fix, verify:

1. **Build Logs** - Build harus sukses tanpa error
2. **Deployment Status** - Status "Active" (hijau)
3. **Live URL** - `https://wedison-hanindo.pages.dev` harus accessible
4. **Homepage** - Harus menampilkan landing page, bukan 404

---

**Setelah update settings, trigger deployment baru atau retry deployment yang ada!**
