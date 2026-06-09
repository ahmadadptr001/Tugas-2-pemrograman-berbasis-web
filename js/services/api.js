const STORAGE_KEYS = {
    PENGGUNA: 'sitta_pengguna',
    STOK: 'sitta_stok',
    TRACKING: 'sitta_tracking',
    UPBJJ_LIST: 'sitta_upbjj',
    KATEGORI_LIST: 'sitta_kategori',
    PENGIRIMAN_LIST: 'sitta_pengiriman',
    PAKET_LIST: 'sitta_paket'
};

function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.PENGGUNA)) {
        const defaultPengguna = [
            { id: 1, nama: "Rina Wulandari", email: "rina@ut.ac.id", password: "rina123", role: "UPBJJ-UT", lokasi: "UPBJJ Jakarta" },
            { id: 2, nama: "Agus Pranoto", email: "agus@ut.ac.id", password: "agus123", role: "UPBJJ-UT", lokasi: "UPBJJ Makassar" },
            { id: 3, nama: "Khafifatul Isaroh", email: "khafifatul@ut.ac.id", password: "khafifatul123", role: "UPBJJ-UT", lokasi: "UPBJJ Purwokerto" },
            { id: 4, nama: "Siti Marlina", email: "siti@ut.ac.id", password: "siti123", role: "Puslaba", lokasi: "Pusat" },
            { id: 5, nama: "Doni Setiawan", email: "doni@ut.ac.id", password: "doni123", role: "Fakultas", lokasi: "FISIP" },
            { id: 6, nama: "Admin SITTA", email: "admin@ut.ac.id", password: "admin123", role: "Administrator", lokasi: "Pusat" }
        ];
        localStorage.setItem(STORAGE_KEYS.PENGGUNA, JSON.stringify(defaultPengguna));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STOK)) {
        const defaultStok = [
            { cover: "Pengantar Manajemen.jpg", kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
            { cover: "Pengantar Akuntansi.jpg", kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
            { cover: "Biologi Umum (Praktikum).jpg", kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
            { cover: "Dasar-Dasar Sosiologi.jpg", kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
        ];
        localStorage.setItem(STORAGE_KEYS.STOK, JSON.stringify(defaultStok));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRACKING)) {
        const defaultTracking = {
            "DO2025-0001": {
                nim: "123456789", nama: "Rina Wulandari", status: "Dalam Perjalanan", ekspedisi: "JNE",
                tanggalKirim: "2025-08-25", paket: "PAKET-UT-001", total: 120000,
                perjalanan: [{ waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" }]
            }
        };
        localStorage.setItem(STORAGE_KEYS.TRACKING, JSON.stringify(defaultTracking));
    }
    if (!localStorage.getItem(STORAGE_KEYS.UPBJJ_LIST)) {
        localStorage.setItem(STORAGE_KEYS.UPBJJ_LIST, JSON.stringify(["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KATEGORI_LIST)) {
        localStorage.setItem(STORAGE_KEYS.KATEGORI_LIST, JSON.stringify(["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENGIRIMAN_LIST)) {
        localStorage.setItem(STORAGE_KEYS.PENGIRIMAN_LIST, JSON.stringify([{ kode: "REG", nama: "Reguler (3-5 hari)" }, { kode: "EXP", nama: "Ekspres (1-2 hari)" }]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAKET_LIST)) {
        localStorage.setItem(STORAGE_KEYS.PAKET_LIST, JSON.stringify([
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
        ]));
    }
}

const API = {
    async login(email, password) {
        initData();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENGGUNA));
        const user = users.find(u => u.email === email && u.password === password);
        return user ? { ...user } : null;
    },
    async getAllStok() {
        initData();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.STOK));
    },
    async addStok(item) {
        const stok = await this.getAllStok();
        stok.unshift(item);
        localStorage.setItem(STORAGE_KEYS.STOK, JSON.stringify(stok));
        return item;
    },
    async updateStok(index, newItem) {
        const stok = await this.getAllStok();
        stok[index] = newItem;
        localStorage.setItem(STORAGE_KEYS.STOK, JSON.stringify(stok));
        return newItem;
    },
    async deleteStok(index) {
        const stok = await this.getAllStok();
        stok.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.STOK, JSON.stringify(stok));
    },
    async getAllTracking() {
        initData();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRACKING));
    },
    async addTracking(doNumber, data) {
        const tracking = await this.getAllTracking();
        tracking[doNumber] = data;
        localStorage.setItem(STORAGE_KEYS.TRACKING, JSON.stringify(tracking));
        return data;
    },
    async getUpbjjList() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.UPBJJ_LIST));
    },
    async getKategoriList() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.KATEGORI_LIST));
    },
    async getPengirimanList() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENGIRIMAN_LIST));
    },
    async getPaketList() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAKET_LIST));
    }
};