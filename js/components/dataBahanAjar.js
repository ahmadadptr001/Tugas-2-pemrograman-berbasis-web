var app = new Vue({
    el: '#app',
    data: {
        showEditModal: false,
        showAddModal: false,
        showSuccessPopup: false,
        showLogoutPopup: false,
        showDeletePopup: false,
        showErrorPopup: false,
        errorMessage: '',
        deleteIndex: null,
        deleteItemName: "",
        isLoading: false,

        filters: { upbjj: "", kategori: "", statusStok: "" },
        sortBy: "",

        upbjjList: [],
        kategoriList: [],
        pengirimanList: [],
        paket: [],
        stok: [],
        tracking: {},

        newTracking: { nim: "", nama: "", ekspedisi: "", paket: "", tanggalKirim: "" },

        progressSelectedDO: "",
        progressKeterangan: "",

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
        },
        // Riwayat perjalanan untuk DO yang dipilih
        selectedDORiwayat() {
            if (!this.progressSelectedDO || !this.tracking[this.progressSelectedDO]) return [];
            return this.tracking[this.progressSelectedDO].perjalanan || [];
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
        stripHtml(html) {
            if (!html) return '';
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || '';
        },

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

        async openEdit(item) {
            this.editIndex = this.stok.indexOf(item);
            this.editItem = { ...item };
            this.showEditModal = true;
        },
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
        openAdd() {
            this.newItem = { cover: "", kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" };
            this.showAddModal = true;
        },
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
        openDelete(item) {
            this.deleteIndex = this.stok.indexOf(item);
            this.deleteItemName = item.judul;
            this.showDeletePopup = true;
        },
        async confirmDelete() {
            if (this.deleteIndex !== null) {
                await API.deleteStok(this.deleteIndex);
                this.stok = await API.getAllStok();
            }
            this.showDeletePopup = false;
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },
        resetFilters() {
            this.filters = { upbjj: "", kategori: "", statusStok: "" };
            this.sortBy = "";
        },

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

        async addTracking() {
            if (this.isLoading) return;
            if (!this.validateTrackingForm()) {
                this.showErrorPopup = true;
                return;
            }
            this.isLoading = true;
            try {
                await API.cekStokPaket(this.newTracking.paket);
                await API.kurangiStokPaket(this.newTracking.paket);
                const nomorBaru = this.generatedDO;
                if (this.tracking[nomorBaru]) {
                    this.errorMessage = `Nomor DO ${nomorBaru} sudah ada, coba lagi.`;
                    this.showErrorPopup = true;
                    return;
                }
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
                this.stok = await API.getAllStok();
                this.newTracking = { nim: "", nama: "", ekspedisi: "", paket: "", tanggalKirim: "" };
                this.showSuccessPopup = true;
                setTimeout(() => this.showSuccessPopup = false, 2000);
            } catch (err) {
                this.errorMessage = err.message;
                this.showErrorPopup = true;
            } finally {
                this.isLoading = false;
            }
        },

        async saveProgress() {
            if (this.isLoading) return;
            if (!this.progressSelectedDO) {
                this.errorMessage = 'Pilih nomor DO terlebih dahulu';
                this.showErrorPopup = true;
                return;
            }
            if (!this.progressKeterangan.trim()) {
                this.errorMessage = 'Status perjalanan tidak boleh kosong';
                this.showErrorPopup = true;
                return;
            }
            this.isLoading = true;
            try {
                const doNumber = this.progressSelectedDO;
                const currentData = this.tracking[doNumber];
                if (!currentData) throw new Error('DO tidak ditemukan');
                
                const waktuSekarang = new Date().toLocaleString();
                const newPerjalanan = {
                    waktu: waktuSekarang,
                    keterangan: this.progressKeterangan
                };
                const updatedPerjalanan = [...(currentData.perjalanan || []), newPerjalanan];
                
                let newStatus = currentData.status;
                const lowerKet = this.progressKeterangan.toLowerCase();
                if (lowerKet.includes('selesai') || lowerKet.includes('diterima') || lowerKet.includes('sampai')) {
                    newStatus = 'Selesai';
                } else if (lowerKet.includes('dikirim') || lowerKet.includes('dikirimkan') || lowerKet.includes('diteruskan')) {
                    newStatus = 'Dikirim';
                } else if (lowerKet.includes('perjalanan') || lowerKet.includes('tiba di') || lowerKet.includes('menuju')) {
                    newStatus = 'Dalam Perjalanan';
                }
                
                await API.updateTracking(doNumber, {
                    perjalanan: updatedPerjalanan,
                    status: newStatus
                });
                this.tracking = await API.getAllTracking();
                this.progressKeterangan = "";
                this.showSuccessPopup = true;
                setTimeout(() => this.showSuccessPopup = false, 2000);
            } catch (err) {
                this.errorMessage = err.message;
                this.showErrorPopup = true;
            } finally {
                this.isLoading = false;
            }
        },

        triggerLogout() {
            this.showLogoutPopup = true;
        },
        confirmLogout() {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        },
        closeErrorPopup() {
            this.showErrorPopup = false;
            this.errorMessage = '';
        }
    },

    watch: {
        'filters.upbjj'(newVal) { 
            if (!newVal) this.filters.kategori = ""; 
        }
    }
});