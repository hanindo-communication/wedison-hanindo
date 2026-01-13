# Logo Folder

## Cara Mengganti Logo

1. Upload file logo Anda dengan nama: **logo.png**
2. Format yang disarankan: PNG dengan transparan
3. Ukuran yang disarankan: Minimal 512x512px untuk kualitas terbaik
4. Pastikan logo memiliki aspect ratio yang baik (square atau landscape)

## Catatan Penting

- File harus bernama persis: `logo.png`
- Jika logo tidak ditemukan atau error, sistem akan otomatis menggunakan placeholder SVG
- Logo akan otomatis menyesuaikan ukuran di navbar dan footer
- Untuk logo di navbar (transparent background), gunakan logo dengan background transparan
- Untuk logo di footer (dark background), logo akan otomatis di-invert

## Revert ke Logo Lama

Jika terjadi masalah, jalankan:
```bash
cp app/components/ui/Logo.backup.tsx app/components/ui/Logo.tsx
```
