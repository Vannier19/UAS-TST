
# Sistem Perpustakaan Terintegrasi — Dokumentasi Singkat

Dibuat oleh: Stevan Einer Bonagabe — 18223028

Live demo (frontend): https://uas-tst-sigma.vercel.app/

Deskripsi singkat
Proyek ini adalah tugas UAS untuk praktik microservices. Terdiri dari dua layanan utama:
- Service A (Inventory Buku) — mengelola data buku
- Service B (Peminjaman) — mengelola riwayat peminjaman
Frontend sederhana berada di folder `FE/` dan menggunakan JavaScript vanilla.

Struktur proyek (ringkas):
- `FE/` — frontend: `index.html`, `style.css`, `script.js`
- `server.js` — service peminjaman (Service B)
- `dummy_loans.json` — data awal (opsional)

Cara singkat menjalankan (catatan mahasiswa)
- Pasang dependensi proyek menggunakan manajer paket yang kamu pakai.
- Jalankan skrip start sesuai `package.json` untuk memulai service peminjaman di lingkungan pengembangan (default: port 9000).
- Untuk frontend, buka `FE/index.html` di browser atau gunakan layanan hosting/static server.

Dokumentasi API (ringkas)
- Service B (publik): https://stevan.tugastst.my.id
  - GET /loans — ambil semua peminjaman
  - POST /loans — tambah peminjaman (kirim JSON dengan properti `borrower_name` dan `book_id`)
  - GET /health — health check

Catatan penting
- Data peminjaman disimpan di memori sehingga akan hilang saat server dimatikan.
- Frontend berkomunikasi ke Service A (`https://michael.tugastst.my.id`) dan Service B (`https://stevan.tugastst.my.id`).

Jika butuh, saya bisa bantu tambahkan instruksi lebih detail atau contoh permintaan API tanpa menampilkan blok perintah di README ini.
