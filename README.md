# 📚 SITTA UT - Sistem Informasi Tracking & Pemesanan Bahan Ajar

**SITTA UT** adalah aplikasi berbasis web untuk mengelola pemesanan, stok bahan ajar, dan tracking pengiriman di lingkungan Universitas Terbuka. Aplikasi ini dibangun dengan **HTML, CSS, JavaScript (Vanilla + Vue 2)** dan menyimpan data secara lokal menggunakan **LocalStorage**. Cocok untuk prototype, demo, atau keperluan administrasi skala kecil.

---

## ✨ Fitur Utama

- 🔐 **Login Multi-role** (UPBJJ, Puslaba, Fakultas, Administrator)
- 📦 **Manajemen Stok Bahan Ajar** (CRUD, filter, sort, status stok Aman/Menipis/Kosong)
- 🚚 **Tracking Pengiriman** (Buat Delivery Order, tambah progres, lihat riwayat)
- 📊 **Laporan Monitoring DO** (timeline pengiriman per DO)
- 📈 **Rekap Data Bahan Ajar** (per UPBJJ, per kategori, peringatan stok menipis)
- 📜 **Histori Transaksi** (filter, cari, urutkan)
- 🎨 **UI Responsif** dan aksesibel

---

## 🛠 Teknologi yang Digunakan

| Teknologi        | Keterangan                              |
|-----------------|------------------------------------------|
| HTML5           | Struktur halaman                         |
| CSS3            | Styling, animasi, layout responsif       |
| JavaScript      | Logika bisnis dan interaksi              |
| **Vue 2**       | Data binding, computed, metode           |
| LocalStorage    | Penyimpanan data offline                 |
| Font Awesome 6  | Ikon                                     |

---

## 📁 Struktur Proyek
```
sitta-ut/
├── assets/
│ ├── css/
│ │ └── styles.css
│ └── img/ # Logo, cover buku, background
├── data/
│ └── dataBahanAjar.json # Data awal (dummy)
├── js/
│ ├── app.js # Fungsi global, auth, utility
│ ├── components/
│ │ └── dataBahanAjar.js # Vue utama (stok, tracking, progres)
│ ├── services/
│ │ └── api.js # Wrapper localStorage (CRUD tracking, stok)
├── templates/
│ ├── dashboard.html
│ ├── login.html
│ ├── stock.html
│ ├── tracking.html
│ ├── histori.html
│ ├── laporan-monitoring.html
│ └── laporan-rekap.html
├── index.html # Redirect ke login
├── package.json # (tidak digunakan untuk develop murni)
└── README.md
```


> **Catatan:** Folder `src/` dan file konfigurasi TypeScript/Vite tidak digunakan karena aplikasi berjalan langsung melalui file HTML statis.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone repositori
```bash
git clone https://github.com/username/sitta-ut.git
cd sitta-ut
```


### 2. Buka dengan Live Server (disarankan)
Gunakan ekstensi Live Server di VS Code, atau:
```bash
npx live-server
```

Atau langsung buka file index.html di browser (pastikan tidak ada kebijakan CORS yang menghalangi loading file local).

### 3. Login dengan akun demo
| Role               | Email                | Password         |
|--------------------|----------------------|------------------|
| UPBJJ Jakarta      | rina@ut.ac.id        | rina123          |
| UPBJJ Makassar     | agus@ut.ac.id        | agus123          |
| UPBJJ Purwokerto   | khafifatul@ut.ac.id  | khafifatul123    |
| Puslaba            | siti@ut.ac.id        | siti123          |
| Fakultas           | doni@ut.ac.id        | doni123          |
| Administrator      | admin@ut.ac.id       | admin123         |


## 🔧 Konfigurasi & Data
Semua data disimpan di LocalStorage browser dengan prefix sitta_. Data awal akan dibuat otomatis saat pertama kali akses.

Reset data: Buka DevTools (F12) → Application → Local Storage → Hapus semua key sitta_* lalu refresh halaman.

## 📄 Lisensi
MIT License - bebas digunakan untuk keperluan pendidikan dan non-komersial.