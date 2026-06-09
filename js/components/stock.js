function showNotif(message, type) {
    const notif = document.getElementById("notif");
    notif.textContent = message;
    notif.className = `notif show ${type}`;
    setTimeout(() => {
        notif.classList.remove("show");
    }, 3000);
}

function renderStokTable() {
    if (!stokTableBody) return;
    stokTableBody.innerHTML = '';
    dataBahanAjar.forEach((item, index) => {
        const row = stokTableBody.insertRow();
        const cellCover = row.insertCell();
        cellCover.innerHTML = `<img src="${item.cover}" alt="Cover ${item.namaBarang}" onerror="this.onerror=null;this.src='img/placeholder.jpg';" title="${item.namaBarang}">`;
        row.insertCell().textContent = item.kodeLokasi;
        row.insertCell().textContent = item.kodeBarang;
        row.insertCell().textContent = item.namaBarang;
        row.insertCell().textContent = item.jenisBarang;
        row.insertCell().textContent = item.edisi;
        const cellStok = row.insertCell();
        cellStok.textContent = item.stok;
        if (item.stok < 200) {
            cellStok.style.backgroundColor = '#ff9009';
            cellStok.style.fontWeight = 'bold';
        }
        const cellAksi = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.className = 'delete-button';
        deleteButton.setAttribute('data-index', index);
        deleteButton.addEventListener('click', (e) => {
            const itemIndex = parseInt(e.target.getAttribute('data-index'));
            deleteStok(itemIndex);
        });
        cellAksi.appendChild(deleteButton);
    });
}

if (stokTableBody) {
    renderStokTable();
}

function deleteStok(index) {
    const namaBarang = dataBahanAjar[index].namaBarang;
    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus stok untuk Bahan Ajar: "${namaBarang}"?`);
    if (konfirmasi) {
        dataBahanAjar.splice(index, 1);
        renderStokTable();
        showNotif(`Bahan Ajar "${namaBarang}" berhasil dihapus dari sistem.`, "success");
    }
}

if (addStockBtn) {
    addStockBtn.addEventListener('click', () => {
        addStockFormSection.style.display = 'block';
        addStockBtn.style.display = 'none';
    });
    cancelAddBtn.addEventListener('click', () => {
        addStockFormSection.style.display = 'none';
        addStockBtn.style.display = 'block';
        newStockForm.reset();
    });
}

if (newStockForm) {
    newStockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const namaBarangInput = document.getElementById('namaBarangNew').value;
        const generatedCoverPath = 'img/' + namaBarangInput.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, '') + '.jpg';
        const newStock = {
            kodeLokasi: document.getElementById('kodeLokasiNew').value.toUpperCase(),
            kodeBarang: document.getElementById('kodeBarangNew').value.toUpperCase(),
            namaBarang: namaBarangInput,
            jenisBarang: document.getElementById('jenisBarangNew').value.toUpperCase(),
            edisi: document.getElementById('edisiNew').value,
            stok: parseInt(document.getElementById('stokNew').value, 10),
            cover: generatedCoverPath,
        };
        dataBahanAjar.push(newStock);
        renderStokTable();
        newStockForm.reset();
        addStockFormSection.style.display = 'none';
        addStockBtn.style.display = 'block';
        showNotif(`Bahan Ajar "${newStock.namaBarang}" berhasil ditambahkan!`, "success");
    });
}