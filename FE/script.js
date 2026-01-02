// ====================================
// KONFIGURASI API ENDPOINTS (HARDCODED)
// ====================================
const SERVICE_A_URL = "https://michael.tugastst.my.id"; // Service A - Inventory Buku
const SERVICE_B_URL = "https://stevan.tugastst.my.id"; // Service B - Peminjaman
// Avoid sending custom headers on simple GETs to reduce CORS preflight failures
const DEFAULT_HEADERS = {};

// ====================================
// GLOBAL VARIABLES
// ====================================
let allBooks = []; // Simpan semua buku untuk filtering
let currentCategory = 'all'; // Kategori aktif

// ====================================
// INISIALISASI - AUTO LOAD DATA
// ====================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('Sistem Perpustakaan Terintegrasi - Loaded');
    fetchBooks();
    fetchLoans();
});

// ====================================
// FETCH DATA BUKU DARI SERVICE A
// ====================================
async function fetchBooks() {
    const container = document.getElementById('book-list');
    const loading = document.getElementById('loading-books');
    
    loading.style.display = 'block';
    container.innerHTML = '';

    try {
        const response = await fetch(`${SERVICE_A_URL}/books`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const books = await response.json();
        loading.style.display = 'none';

        if (books.length === 0) {
            container.innerHTML = '<p class="empty-state">Tidak ada buku tersedia.</p>';
            return;
        }

        // Simpan ke variabel global untuk filtering
        allBooks = categorizeBooks(books);
        
        // Tampilkan sesuai kategori aktif
        displayBooks(allBooks);

        console.log(`Berhasil memuat ${books.length} buku`);

    } catch (error) {
        loading.style.display = 'none';
        container.innerHTML = `<p class="error-state">Gagal memuat data buku: ${error.message}</p>`;
        console.error('Error fetching books:', error);
    }
}

// ====================================
// KATEGORISASI BUKU
// ====================================
function categorizeBooks(books) {
    // Bagi buku secara merata ke 3 kategori
    const totalBooks = books.length;
    const booksPerCategory = Math.ceil(totalBooks / 3);
    
    return books.map((book, index) => {
        if (index < booksPerCategory) {
            book.category = 'rekomendasi';
        } else if (index < booksPerCategory * 2) {
            book.category = 'populer';
        } else {
            book.category = 'terbaru';
        }
        return book;
    });
}

// ====================================
// TAMPILKAN BUKU (DENGAN FILTER)
// ====================================
function displayBooks(books) {
    const container = document.getElementById('book-list');
    container.innerHTML = '';

    // Filter berdasarkan kategori
    let filteredBooks = books;
    if (currentCategory !== 'all') {
        filteredBooks = books.filter(book => book.category === currentCategory);
    }

    // Filter berdasarkan search query
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    if (searchQuery) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchQuery) || 
            book.author.toLowerCase().includes(searchQuery)
        );
    }

    if (filteredBooks.length === 0) {
        container.innerHTML = '<p class="empty-state">Tidak ada buku yang sesuai dengan pencarian.</p>';
        return;
    }

    filteredBooks.forEach(book => {
        const card = createBookCard(book);
        container.appendChild(card);
    });
}

// ====================================
// MEMBUAT CARD BUKU
// ====================================
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';

    const statusClass = book.available ? 'status-available' : 'status-unavailable';
    const statusText = book.available ? 'Tersedia' : 'Dipinjam';
    const buttonDisabled = !book.available ? 'disabled' : '';

    card.innerHTML = `
        <div class="book-header">
            <h3>${book.title}</h3>
        </div>
        <p class="book-author">${book.author}</p>
        <p class="book-id">ID: ${book.id}</p>
        <div class="card-actions">
            <button class="btn-borrow" onclick="openBorrowModal(${book.id}, '${escapeHtml(book.title)}')" ${buttonDisabled}>${book.available ? 'Pinjam' : 'Tidak Tersedia'}</button>
            <button class="btn-delete" onclick="deleteBook(${book.id})" title="Hapus buku">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="#8a6b57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#8a6b57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#8a6b57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="#8a6b57" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
    `;

    return card;
}

// ====================================
// ESCAPE HTML (KEAMANAN)
// ====================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================================
// FUNGSI SEARCH BUKU
// ====================================
function searchBooks() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('btn-clear-search');
    
    // Tampilkan tombol clear jika ada input
    if (searchInput.value.trim() !== '') {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    displayBooks(allBooks);
}

// ====================================
// CLEAR SEARCH
// ====================================
function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('btn-clear-search').style.display = 'none';
    displayBooks(allBooks);
}

// ====================================
// FILTER KATEGORI
// ====================================
function filterCategory(category) {
    currentCategory = category;
    
    // Update active button
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Clear search saat ganti kategori
    document.getElementById('search-input').value = '';
    document.getElementById('btn-clear-search').style.display = 'none';
    
    displayBooks(allBooks);
}

// ====================================
// FETCH RIWAYAT PEMINJAMAN DARI SERVICE B
// ====================================
async function fetchLoans() {
    const tbody = document.getElementById('loan-list');
    const loading = document.getElementById('loading-loans');
    
    loading.style.display = 'block';
    tbody.innerHTML = '';

    try {
        const response = await fetch(`${SERVICE_B_URL}/loans`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const loans = await response.json();
        loading.style.display = 'none';

        if (loans.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada riwayat peminjaman.</td></tr>';
            return;
        }

        loans.forEach(loan => {
            const row = document.createElement('tr');
            const statusClass = loan.status === 'borrowed' ? 'status-borrowed' : 'status-returned';
            const statusText = loan.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan';

            row.innerHTML = `
                <td>${loan.id}</td>
                <td>${loan.borrower_name}</td>
                <td>${loan.book_id}</td>
                <td>${loan.loan_date}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
            `;
            tbody.appendChild(row);
        });

        console.log(`Berhasil memuat ${loans.length} riwayat peminjaman`);

    } catch (error) {
        loading.style.display = 'none';
        tbody.innerHTML = `<tr><td colspan="5" class="error-state">Gagal memuat riwayat: ${error.message}</td></tr>`;
        console.error('Error fetching loans:', error);
    }
}

// ====================================
// MODAL - BUKA FORM PEMINJAMAN
// ====================================
function openBorrowModal(bookId, bookTitle) {
    const modal = document.getElementById('modal-borrow');
    document.getElementById('modal-book-title').textContent = bookTitle;
    document.getElementById('modal-book-id-display').textContent = bookId;
    document.getElementById('input-book-id').value = bookId;
    document.getElementById('input-borrower').value = '';
    
    modal.style.display = 'flex';
}

// ====================================
// MODAL - TUTUP
// ====================================
function closeModal() {
    const modal = document.getElementById('modal-borrow');
    modal.style.display = 'none';
}

// Tutup modal jika klik di luar
window.onclick = function(event) {
    const modal = document.getElementById('modal-borrow');
    if (event.target === modal) {
        closeModal();
    }
}

// ====================================
// SUBMIT PEMINJAMAN (POST KE SERVICE B)
// ====================================
async function submitLoan() {
    const bookId = parseInt(document.getElementById('input-book-id').value);
    const borrowerName = document.getElementById('input-borrower').value.trim();

    // Validasi Input
    if (!borrowerName) {
        showWarningModal('Nama peminjam harus diisi');
        return;
    }

    // Prepare Request Body
    const requestBody = {
        borrower_name: borrowerName,
        book_id: bookId
    };

    try {
        const response = await fetch(`${SERVICE_B_URL}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Peminjaman berhasil:', result);

        // Tutup Modal Form
        closeModal();

        // Tampilkan modal sukses
        showSuccessModal(borrowerName, bookId);

        // Refresh Data
        fetchBooks();
        fetchLoans();

    } catch (error) {
        showWarningModal(`Gagal melakukan peminjaman: ${error.message}`);
        console.error('Error submitting loan:', error);
    }
}

// Tampilkan modal sukses
function showSuccessModal(name, bookId) {
    const modal = document.getElementById('modal-success');
    const message = document.getElementById('success-message');
    message.textContent = `${name} berhasil meminjam buku ID ${bookId}`;
    modal.style.display = 'flex';
    
    // Auto close setelah 3 detik
    setTimeout(() => {
        closeSuccessModal();
    }, 3000);
}

// Tutup modal sukses
function closeSuccessModal() {
    document.getElementById('modal-success').style.display = 'none';
}

// Tampilkan modal peringatan
function showWarningModal(message) {
    const modal = document.getElementById('modal-warning');
    const messageEl = document.getElementById('warning-message');
    messageEl.textContent = message;
    modal.style.display = 'flex';
}

// Tutup modal peringatan
function closeWarningModal() {
    document.getElementById('modal-warning').style.display = 'none';
}

// =====================
// BOOK CRUD (Service A)
// =====================
async function addBook() {
    const title = document.getElementById('input-new-title').value.trim();
    const author = document.getElementById('input-new-author').value.trim();
    if (!title || !author) {
        showNotif('Judul dan pengarang harus diisi');
        return;
    }
    try {
        const res = await fetch(`${SERVICE_A_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });
        if (!res.ok) {
            const err = await res.json().catch(()=>({ error: 'Gagal menambah buku' }));
            throw new Error(err.error || 'Gagal menambah buku');
        }
        closeAddBookModal();
        fetchBooks();
        showNotif('Buku berhasil ditambahkan');
    } catch (e) {
        showNotif(e.message || 'Error');
    }
}

async function deleteBook(id) {
    if (!confirm('Hapus buku ini?')) return;
    try {
        const res = await fetch(`${SERVICE_A_URL}/books/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json().catch(()=>({ error: 'Gagal menghapus buku' }));
            throw new Error(err.error || 'Gagal menghapus buku');
        }
        fetchBooks();
        showNotif('Buku dihapus');
    } catch (e) {
        showNotif(e.message || 'Error');
    }
}

// =====================
// UI Helpers
// =====================
function openAddBookModal() { document.getElementById('modal-add').style.display = 'flex'; }
function closeAddBookModal() { document.getElementById('modal-add').style.display = 'none'; document.getElementById('input-new-title').value=''; document.getElementById('input-new-author').value=''; }

function showNotif(msg, timeout=2500){ const n = document.getElementById('notif'); n.textContent = msg; n.style.display='block'; setTimeout(()=> n.style.display='none', timeout); }