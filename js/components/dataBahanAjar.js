var app = new Vue({
    el: '#app',
    data: {
        showEditModal: false, showAddModal: false, showConfirmLogout: false,
        showSuccessPopup: false, showLogoutPopup: false, showDeletePopup: false,
        deleteIndex: null, deleteItemName: "",
        filters: { upbjj: "", kategori: "", statusStok: "" },
        sortBy: "",
        upbjjList: [], kategoriList: [], pengirimanList: [], paket: [],
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
        async openEdit(item) {
            this.editIndex = this.stok.indexOf(item);
            this.editItem = { ...item };
            this.showEditModal = true;
        },
        async saveEdit() {
            if (this.editIndex !== null) {
                await API.updateStok(this.editIndex, this.editItem);
                this.stok = await API.getAllStok();
            }
            this.showEditModal = false;
            this.showSuccessPopup = true;
            setTimeout(() => this.showSuccessPopup = false, 2000);
        },
        async addTracking() {
            const nomorBaru = this.generatedDO;
            const newData = {
                nim: this.newTracking.nim, nama: this.newTracking.nama, status: "Diproses",
                ekspedisi: this.newTracking.ekspedisi, tanggalKirim: this.newTracking.tanggalKirim,
                paket: this.newTracking.paket, total: this.selectedPaket ? this.selectedPaket.harga : 0,
                perjalanan: [{ waktu: new Date().toLocaleString(), keterangan: "DO berhasil dibuat" }]
            };
            await API.addTracking(nomorBaru, newData);
            this.tracking = await API.getAllTracking();
            this.newTracking = { nim: "", nama: "", ekspedisi: "", paket: "", tanggalKirim: "" };
        },
        openAdd() {
            this.newItem = { cover: "", kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" };
            this.showAddModal = true;
        },
        async saveAdd() {
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
        triggerLogout() {
            this.showLogoutPopup = true;
            setTimeout(() => {
                this.showLogoutPopup = false;
                window.location.href = "login.html";
            }, 2000);
        },
        confirmLogout() {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        },
    },
    watch: {
        'filters.upbjj'(newVal) { if (!newVal) this.filters.kategori = ""; }
    }
});

