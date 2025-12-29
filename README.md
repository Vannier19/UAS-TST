# Sistem Perpustakaan Terintegrasi - Microservices

**Dibuat oleh:** Stevan Einer Bonagabe - 18223028  
**Mata Kuliah:** Teknologi Sistem Terintegrasi (TST)  
**Tugas:** Ujian Akhir Semester (UAS)

---

## Deskripsi Sistem

Proyek ini merupakan implementasi sistem perpustakaan berbasis microservices yang terdiri dari:
- **Service A (Inventory Buku)** - Mengelola data katalog buku
- **Service B (Peminjaman)** - Mengelola data peminjaman
- **Frontend (Web App)** - Antarmuka pengguna untuk interaksi dengan kedua service

Sistem ini menggunakan arsitektur REST API dengan penyimpanan data in-memory untuk keperluan pembelajaran dan demonstrasi.

---

## Struktur Proyek

```
UAS-TST/
├── FE/                    # Frontend Application
│   ├── index.html         # Halaman utama
│   ├── style.css          # Styling
│   └── script.js          # Logic JavaScript
├── server.js              # Service B - Peminjaman
├── package.json           # Konfigurasi Node.js
├── dummy_loans.json       # Data dummy peminjaman
├── Dockerfile             # Container configuration
└── README.md              # Dokumentasi
```

---

## Cara Menjalankan

### Backend (Service B)

1. Install dependensi:
   ```bash
   npm install
   ```

2. Jalankan server:
   ```bash
   npm start
   ```
   Server akan berjalan di `http://localhost:9000`

### Frontend

1. Buka file `FE/index.html` di browser
2. Atau gunakan Live Server jika menggunakan VS Code

### Menggunakan Docker

```bash
docker build -t loan-service .
docker run -p 9000:9000 loan-service
```

---

## Dokumentasi API (Service B)

Base URL: `http://localhost:9000`

### 1. GET /loans

Mengambil semua data peminjaman.

**Response:**
```json
[
  {
    "id": 1,
    "borrower_name": "Budi Santoso",
    "book_id": 101,
    "loan_date": "2025-12-01",
    "status": "borrowed"
  }
]
```

### 2. POST /loans

Menambahkan peminjaman baru.

**Request:**
```json
{
  "borrower_name": "Nama Peminjam",
  "book_id": 101
}
```

**Response:**
```json
{
  "id": 11,
  "borrower_name": "Nama Peminjam",
  "book_id": 101,
  "loan_date": "2025-12-29",
  "status": "borrowed"
}
```

### 3. GET /health

Cek status server.

**Response:**
```json
{
  "status": "sehat",
  "service": "Layanan Manajemen Peminjaman",
  "port": "9000"
}
```

---

## Fitur Frontend

### 1. Katalog Buku
- Menampilkan daftar buku dari Service A
- Card layout dengan informasi judul, pengarang, dan status
- Badge status ketersediaan (Tersedia/Dipinjam)

### 2. Pencarian Buku
- Search bar untuk mencari buku berdasarkan judul atau pengarang
- Real-time filtering saat mengetik
- Tombol clear untuk reset pencarian

### 3. Filter Kategori
- **Semua** - Menampilkan semua buku
- **⭐ Rekomendasi** - Buku pilihan
- **🔥 Populer** - Buku populer
- **🆕 Terbaru** - Buku terbaru

### 4. Peminjaman Buku
- Modal form untuk input nama peminjam
- Validasi input dengan notifikasi modal
- Notifikasi sukses dengan popup custom
- Auto-refresh data setelah peminjaman berhasil

### 5. Riwayat Peminjaman
- Tabel daftar peminjaman dari Service B
- Informasi ID, nama peminjam, ID buku, tanggal, dan status
- Auto-update setelah peminjaman baru

### 6. Responsive Design
- Layout 2 kolom untuk desktop
- Layout 1 kolom untuk mobile/tablet
- Optimized untuk berbagai ukuran layar

---

## Teknologi yang Digunakan

### Backend
- Node.js
- HTTP Module (Native)
- File System (fs)
- In-Memory Storage

### Frontend
- HTML5
- CSS3 (Vanilla CSS)
- JavaScript (ES6+)
- Fetch API

---

## Catatan Penting

- Data disimpan di memori, akan hilang saat server restart
- ID peminjaman menggunakan auto-increment
- CORS sudah diaktifkan untuk integrasi frontend
- Sistem berjalan pada port 9000 (Service pencatatan peminjaman)
