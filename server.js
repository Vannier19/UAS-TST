const http = require('http');
const fs = require('fs');
const url = require('url');

// Data peminjaman disimpan di sini (hilang kalau server dimatikan)
let loans = [];
let nextID = 1; // ID naik terus

// Load data awal dari file JSON (kalau ada)
function loadDummyData() {
  try {
    const data = fs.readFileSync('dummy_loans.json', 'utf8');
    loans = JSON.parse(data);
    const maxID = Math.max(...loans.map(l => l.id), 0);
    nextID = maxID + 1;
    console.log(`Data dummy (${loans.length}) berhasil dimuat.`);
  } catch (err) {
    console.log(`Gagal load dummy_loans.json: ${err.message}`);
    console.log('Mulai dengan data kosong.');
  }
}

// Biar bisa diakses dari mana aja (CORS)
function enableCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// (Dummy) Cek buku ke Service A (tidak dipakai di demo ini)
async function validateBookAvailability(bookID) {
  // Kosong, validasi asli di-comment
  return true;
}

// GET /loans - ambil semua data
function getLoansHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(loans));
}

// POST /loans - tambah data baru
function createLoanHandler(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const reqData = JSON.parse(body);
      if (!reqData.borrower_name || reqData.borrower_name.trim() === '') {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'borrower_name harus diisi' }));
        return;
      }
      if (!reqData.book_id || reqData.book_id <= 0) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'book_id yang valid harus diisi' }));
        return;
      }
      // Validasi buku ke Service A di-skip
      const newLoan = {
        id: nextID,
        borrower_name: reqData.borrower_name,
        book_id: reqData.book_id,
        loan_date: new Date().toISOString().split('T')[0],
        status: 'borrowed'
      };
      loans.push(newLoan);
      nextID++;
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(201);
      res.end(JSON.stringify(newLoan));
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Body request tidak valid' }));
    }
  });
}

// GET /health - cek server
function healthHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({
    status: 'sehat',
    service: 'Layanan Manajemen Peminjaman',
    port: '9000'
  }));
}

// Buat OPTIONS biar CORS aman
function handleOptions(req, res) {
  enableCORS(res);
  res.writeHead(200);
  res.end();
}

// Bikin server HTTP
const server = http.createServer((req, res) => {
  enableCORS(res);
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  if (method === 'OPTIONS') {
    handleOptions(req, res);
    return;
  }
  if (pathname === '/loans') {
    if (method === 'GET') {
      getLoansHandler(req, res);
    } else if (method === 'POST') {
      createLoanHandler(req, res);
    } else {
      res.writeHead(405);
      res.end('Metode tidak diizinkan');
    }
  } else if (pathname === '/health') {
    healthHandler(req, res);
  } else {
    res.writeHead(404);
    res.end('Endpoint tidak ditemukan');
  }
});

// Load data dummy kalau ada
loadDummyData();

// Start server
const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Server peminjaman jalan di port ${PORT}`);
  console.log('Endpoint:');
  console.log('  GET  /loans');
  console.log('  POST /loans');
  console.log('  GET  /health');
  console.log('Data disimpan di memori, restart = data hilang');
});
