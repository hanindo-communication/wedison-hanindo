# Logo Component - Revert Guide

## Jika Logo Menyebabkan Masalah

Jika setelah mengganti logo, konten landing page hilang atau tidak terlihat, ikuti langkah berikut:

### Cara 1: Menggunakan Script (Paling Mudah)

```bash
./REVERT_LOGO.sh
```

Atau jika script tidak bisa dijalankan:

```bash
bash REVERT_LOGO.sh
```

### Cara 2: Manual Revert

1. Buka terminal di folder project
2. Jalankan perintah:

```bash
cp app/components/ui/Logo.backup.tsx app/components/ui/Logo.tsx
```

3. Restart development server jika sedang berjalan:
   - Tekan `Ctrl+C` untuk stop server
   - Jalankan `npm run dev` lagi

### Cara 3: Git Revert (Jika sudah commit)

```bash
git checkout app/components/ui/Logo.tsx
```

## Struktur File

- `app/components/ui/Logo.tsx` - Komponen Logo aktif (dengan image support)
- `app/components/ui/Logo.backup.tsx` - Backup komponen Logo lama (SVG only)
- `public/logo/logo.png` - File logo yang akan digunakan (upload di sini)
- `public/logo/README.md` - Instruksi upload logo

## Fitur Komponen Logo Baru

✅ **Auto-detect image**: Otomatis menggunakan logo.png jika ada  
✅ **Fallback aman**: Jika image error, otomatis pakai placeholder SVG  
✅ **Tidak merusak layout**: Struktur tetap sama dengan versi lama  
✅ **Support className**: Masih support brightness-0 dan invert untuk navbar/footer  

## Troubleshooting

### Logo tidak muncul
- Pastikan file bernama persis: `logo.png` (huruf kecil)
- Pastikan file ada di folder `public/logo/`
- Cek console browser untuk error

### Konten hilang setelah ganti logo
- **SEGERA REVERT** menggunakan salah satu cara di atas
- Logo component tidak seharusnya mempengaruhi konten lain
- Jika masih terjadi, kemungkinan ada masalah di komponen lain

### Logo terlihat blur
- Gunakan logo dengan resolusi tinggi (minimal 512x512px)
- Format PNG dengan transparan untuk hasil terbaik
