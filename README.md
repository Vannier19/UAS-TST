
# Sistem Perpustakaan Terintegrasi

Dibuat oleh: Stevan Einer Bonagabe — 18223028

Live demo (frontend): https://uas-tst-sigma.vercel.app/

## Deskripsi
Proyek ini adalah tugas UAS untuk praktik microservices. Terdiri dari dua layanan utama:
- **Service A (Inventory Buku)** — mengelola data buku (https://michael.tugastst.my.id)
- **Service B (Peminjaman)** — mengelola riwayat peminjaman (https://stevan.tugastst.my.id)
Frontend sederhana berada di folder `FE/` dan menggunakan JavaScript vanilla.

## Struktur Proyek
```
├── FE/
│   ├── index.html        # Halaman utama UI perpustakaan
│   ├── style.css         # Styling dengan font Quicksand
│   └── script.js         # Logika frontend (fetch API, filtering, search)
├── server.js             # Backend Service B (Node.js HTTP server)
├── package.json          # Dependencies & scripts
├── dummy_loans.json      # Data dummy peminjaman (opsional)
├── Dockerfile            # Container config untuk Service B
└── API_DOCUMENTATION.md  # Dokumentasi API lengkap
```

## Backend (Service B - Peminjaman)
**Teknologi:** Node.js (HTTP native, tanpa framework)
**Port:** 9000
**Base URL:** https://stevan.tugastst.my.id

### Fitur Backend:
- REST API untuk manajemen peminjaman (in-memory storage)
- Validasi ketersediaan buku ke Service A via HTTPS
- CORS enabled untuk akses dari frontend
- Health check endpoint
- Auto-load data dummy dari `dummy_loans.json`

### Endpoints:
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/loans` | Ambil semua data peminjaman |
| POST | `/loans` | Tambah peminjaman baru (body: `borrower_name`, `book_id`) |
| GET | `/health` | Cek status server |

### Cara Menjalankan:
```bash
npm install
npm start    # Server berjalan di port 9000
```

### Docker:
```bash
docker build -t loan-service .
docker run -p 9000:9000 loan-service
```

## Frontend
**Teknologi:** HTML5, CSS3, Vanilla JavaScript
**Deployed:** Vercel (https://uas-tst-sigma.vercel.app/)

### Fitur Frontend:
- **Katalog Buku**: Menampilkan semua buku dari Service A
- **Kategori Filter**: Rekomendasi, Populer, Terbaru, Semua
- **Search**: Cari buku berdasarkan judul atau pengarang (real-time)
- **Tambah Buku**: Modal form untuk menambah buku baru ke Service A
- **Peminjaman**: Modal form untuk meminjam buku (validasi ketersediaan otomatis)
- **Riwayat Peminjaman**: Tabel riwayat peminjaman dari Service B
- **Responsive Design**: UI modern dengan Google Fonts (Quicksand)

### Konfigurasi API:
```javascript
SERVICE_A_URL: "https://michael.tugastst.my.id"
SERVICE_B_URL: "https://stevan.tugastst.my.id"
```

## Catatan Penting
- Data peminjaman disimpan di memori sehingga akan hilang saat server dimatikan
- Frontend berkomunikasi ke Service A (`https://michael.tugastst.my.id`) dan Service B (`https://stevan.tugastst.my.id`)
- Service B melakukan validasi ketersediaan buku ke Service A sebelum peminjaman
- Deployment production menggunakan Vercel (FE) dan infrastruktur cloud untuk backend

## Dokumentasi Lengkap
Lihat [API_DOCUMENTATION.md](API_DOCUMENTATION.md) untuk detail lengkap endpoint dan contoh request/response.
