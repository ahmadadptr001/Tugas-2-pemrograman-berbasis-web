var app = new Vue({
    el: '#app',
    data: {
        showEditModal: false,
        showAddModal: false,
        showConfirmLogout: false,
        showSuccessPopup: false,
        showLogoutPopup: false,
        showDeletePopup: false,
        showErrorPopup: false,
        errorMessage: '',
        deleteIndex: null,
        deleteItemName: "",
        filters: { upbjj: "", kategori: "", statusStok: "" },
        sortBy: "",
        upbjjList: [],
        kategoriList: [],
        pengirimanList: [],
        paket: [],
        stok: [],
        tracking: {},
        newTracking: { nim: "", nama: "", ekspedisi: "", paket: "", tanggalKirim: "" },
        editIndex: null,
        editItem: { cover: "", kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" },
        newItem: { cover: "", kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" }
    },
    computed: {
        filteredStok() {
            let result = [...this.stok];
            if (this.filters.upbjj) result = result.filter(i => i.upbjj === this.filters.upbjj);
            if (this.filters.upbjj && this.filters.kategori) result = result.filter(i => i.kategori === this.filters.kategori);
            if (this.filters.statusStok === 'reorder') result = result.filter(i => i.qty < i.safety || i.qty === 0);
            else if (this.filters.statusStok === 'kosong') result = result.filter(i => i.qty === 0);
            if (this.sortBy === 'judul') result.sort((a,b) => a.judul.localeCompare(b.judul));
            else if (this.sortBy === 'qty') result.sort((a,b) => a.qty - b.qty);
            else if (this.sortBy === 'harga') result.sort((a,b) => a.harga - b.harga);
            return result;
        },
        generatedDO() {
            const tahun = new Date().getFullYear();
            const jumlah = Object.keys(this.tracking).length + 1;
            return `DO${tahun}-${String(jumlah).padStart(3,'0')}`;
        },
        selectedPaket() {
            return this.paket.find(p => p.kode === this.newTracking.paket);
        }
    },
    async mounted() {
        this.upbjjList = await API.getUpbjjList();
        this.kategoriList = await API.getKategoriList();
        this.pengirimanList = await API.getPengirimanList();
        this.paket = await API.getPaketList();
        this.stok = await API.getAllStok();
        this.tracking = await API.getAllTracking();
    },
    methods: {
        // Membersihkan tag HTML untuk tooltip
        stripHtml(html) {
            if (!html) return '';
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || '';
        },

        // Validasi form tambah bahan ajar
        validateNewItem() {
            const required = ['cover', 'kode', 'judul', 'kategori', 'upbjj', 'lokasiRak', 'harga', 'qty', 'safety'];
            for (let field of required) {
                if (!this.newItem[field] && this.newItem[field] !== 0) {
                    this.errorMessage = `Field "${field}" tidak boleh kosong!`;
                    return false;
                }
            }
            if (isNaN(this.newItem.harga) || this.newItem.harga <= 0) {
                this.errorMessage = 'Harga harus angka positif';
                return false;
            }
            if (isNaN(this.newItem.qty) || this.newItem.qty < 0) {
                this.errorMessage = 'Jumlah stok tidak boleh negatif';
                return false;
            }
            if (isNaN(this.newItem.safety) || this.newItem.safety < 0) {
                this.errorMessage = 'Safety stock tidak boleh negatif';
                return false;
            }
            this.newItem.harga = Number(this.newItem.harga);
            this.newItem.qty = Number(this.newItem.qty);
            this.newItem.safety = Number(this.newItem.safety);
            return true;
        },

        // Validasi form edit bahan ajar
        validateEditItem() {
            const required = ['kode', 'judul', 'kategori', 'upbjj', 'lokasiRak', 'harga', 'qty', 'safety'];
            for (let field of required) {
                if (!this.editItem[field] && this.editItem[field] !== 0) {
                    this.errorMessage = `Field "${field}" tidak boleh kosong!`;
                    return false;
                }
            }
            if (isNaN(this.editItem.harga) || this.editItem.harga <= 0) {
                this.errorMessage = 'Harga harus angka positif';
                return false;
            }
            if (isNaN(this.editItem.qty) || this.editItem.qty < 0) {
                this.errorMessage = 'Jumlah stok tidak boleh negatif';
                return false;
            }
            if (isNaN(this.editItem.safety) || this.editItem.safety < 0) {
                this.errorMessage = 'Safety stock tidak boleh negatif';
                return false;
            }
            this.editItem.harga = Number(this.editItem.harga);
            this.editItem.qty = Number(this.editItem.qty);
            this.editItem.safety = Number(this.editItem.safety);
            return true;
        },

        // Validasi form tracking DO
        validateTrackingForm() {
            if (!this.newTracking.nim) {
                this.errorMessage = 'NIM tidak boleh kosong';
                return false;
            }
            if (!this.newTracking.nama) {
                this.errorMessage = 'Nama penerima tidak boleh kosong';
                return false;
            }
            if (!this.newTracking.ekspedisi) {
                this.errorMessage = 'Ekspedisi harus dipilih';
                return false;
            }
            if (!this.newTracking.paket) {
                this.errorMessage = 'Paket bahan ajar harus dipilih';
                return false;
            }
            if (!this.newTracking.tanggalKirim) {
                this.errorMessage = 'Tanggal kirim harus diisi';
                return false;
            }
            return true;
        },

        // Buka modal edit
        async openEdit(item) {
            this.editIndex = this.stok.indexOf(item);
            this.editItem = { ...item };
            this.showEditModal = true;
        },

        // Simpan edit
        async saveEdit() {
            if (!this.validateEditItem()) {
                this.showErrorPopup = true;
                return;
            }
            if (this.editIndex !== null) {
                await API.updateStok(this.editIndex, this.editItem);
                this.stok = await API.getAllStok();
            }
            this.showEditModal = false;
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },

        // Tambah tracking DO (dengan pengurangan stok)
        async addTracking() {
            if (!this.validateTrackingForm()) {
                this.showErrorPopup = true;
                return;
            }
            // Cek ketersediaan stok paket
            try {
                await API.cekStokPaket(this.newTracking.paket);
            } catch (err) {
                this.errorMessage = err.message;
                this.showErrorPopup = true;
                return;
            }
            // Kurangi stok
            try {
                await API.kurangiStokPaket(this.newTracking.paket);
            } catch (err) {
                this.errorMessage = err.message;
                this.showErrorPopup = true;
                return;
            }
            const nomorBaru = this.generatedDO;
            const selectedPaket = this.selectedPaket;
            const newData = {
                nim: this.newTracking.nim,
                nama: this.newTracking.nama,
                status: "Diproses",
                ekspedisi: this.newTracking.ekspedisi,
                tanggalKirim: this.newTracking.tanggalKirim,
                paket: this.newTracking.paket,
                total: selectedPaket ? selectedPaket.harga : 0,
                perjalanan: [{ waktu: new Date().toLocaleString(), keterangan: "DO berhasil dibuat" }]
            };
            await API.addTracking(nomorBaru, newData);
            this.tracking = await API.getAllTracking();
            this.stok = await API.getAllStok(); // refresh stok
            this.newTracking = { nim: "", nama: "", ekspedisi: "", paket: "", tanggalKirim: "" };
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },

        // Buka modal tambah
        openAdd() {
            this.newItem = { cover: "", kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" };
            this.showAddModal = true;
        },

        // Simpan tambah
        async saveAdd() {
            if (!this.validateNewItem()) {
                this.showErrorPopup = true;
                return;
            }
            await API.addStok({ ...this.newItem });
            this.stok = await API.getAllStok();
            this.showAddModal = false;
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },

        // Buka konfirmasi hapus
        openDelete(item) {
            this.deleteIndex = this.stok.indexOf(item);
            this.deleteItemName = item.judul;
            this.showDeletePopup = true;
        },

        // Hapus data
        async confirmDelete() {
            if (this.deleteIndex !== null) {
                await API.deleteStok(this.deleteIndex);
                this.stok = await API.getAllStok();
            }
            this.showDeletePopup = false;
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },

        // Reset filter dan sorting
        resetFilters() {
            this.filters = { upbjj: "", kategori: "", statusStok: "" };
            this.sortBy = "";
        },

        // Logout
        triggerLogout() {
            this.showLogoutPopup = true;
        },
        confirmLogout() {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        },

        // Tutup popup error
        closeErrorPopup() {
            this.showErrorPopup = false;
            this.errorMessage = '';
        }
    },
    watch: {
        'filters.upbjj'(newVal) { if (!newVal) this.filters.kategori = ""; }
    }
});