# Dokumentasi API - Layanan Peminjaman (Service B)

Layanan ini bertanggung jawab untuk mengelola riwayat peminjaman buku.

## Base URL Public
`https://stevan.tugastst.my.id`

## Endpoints

### 1. Dapatkan Semua Peminjaman
- **URL:** `https://stevan.tugastst.my.id/loans`
- **Method:** `GET`
- **Response Success (200 OK):**
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

### 2. Tambah Peminjaman
- **URL:** `https://stevan.tugastst.my.id/loans`
- **Method:** `POST`
- **Body Request:**
```json
{
  "borrower_name": "Nama Peminjam",
  "book_id": 101
}
```
- **Response Success (201 Created):**
```json
{
  "id": 11,
  "borrower_name": "Nama Peminjam",
  "book_id": 101,
  "loan_date": "2025-12-29",
  "status": "borrowed"
}
```

### 3. Health Check
- **URL:** `https://stevan.tugastst.my.id/health`
- **Method:** `GET`
- **Response:**
```json
{
  "status": "sehat",
  "service": "Layanan Manajemen Peminjaman"
}
```

