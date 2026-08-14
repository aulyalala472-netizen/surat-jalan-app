// Variable Global Penanda Mode Edit
let editModeNoSurat = null; // null = Mode Tambah Baru, String = Mode Edit

const MASTER_DATA = {
    "CV. CITRA PERKASA": [
        { part: "LONG 1001 NUT 12 M3", spek: "WHITE", harga: 4000, unit: "KG" },
        { part: "LONG NUT COOPER", spek: "WHITE", harga: 4000, unit: "KG" },
        { part: "NUT WELD M12", spek: "WHITE", harga: 4000, unit: "KG" },
        { part: "H9 LONG NUT", spek: "WHITE", harga: 4000, unit: "KG" },
        { part: "H37 LONG NUT", spek: "WHITE", harga: 4000, unit: "KG" }
    ],
    "PAK AGUS ( TRI TUNGGAL)": [
        { part: "MANGKOK RODA", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "PLATE RODA", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "BAUT M12X25 & CLAMP", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "BOLD", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "CLAM", spek: "BLUE CR3+", harga: 4000, unit: "KG" }
    ],
    "PT. GELAR INTI ANUGRAH TERJAYA": [
        { part: "MUR HEX 88 M06 KG", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "BO HEX 88 M06X15MM FT", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "BM HEX 88 M08X35MM", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "BO HEX 88 M06X20MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M16X35MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M16X40MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M16X50MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M20X45MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M20X70MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M16X45MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M18X40MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M16X30MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M16X90 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 10.9 M12X40MM HT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M08X40 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M12X110MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M06X40 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M12X90 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M12X60 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M12X80 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M12X70 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M16X90 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M24X80MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M24X50 MM FT HTM", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M06X16 MM FT", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "BO HEX 88 M06X15 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M06X80 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M12X25 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M08X25 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M08X20 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M06X20 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M06X15 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M06X10 MM FT", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "M10X30 MM", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M06X25 MM FT", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "14XNC 3/8\"1", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "MUR HEX M12 P 1,25 KN6", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "JF+MUR M05X50MM", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "SCREW 1-3/4 X 127 MM", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "BO HEX 88 M10 X 80M FT", spek: "PUTIH", harga: 3000, unit: "KG" },
        { part: "MUR HEX M12", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M06X25 MM + MUR M06", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BO HEX 88 M10X25MM", spek: "KUNING", harga: 3500, unit: "KG" },
        { part: "BM HEX 88 M06 FT", spek: "KUNING", harga: 3500, unit: "KG" }
    ],
    "PT. GISEN TEKNIK PRESISI": [
        { part: "MIO 12,5X7,3X11,1 (7 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X8,1X11,1 ( 6 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X5,2X11,1 (9 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BEAT 12,5X12,1 (7 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BEAT 12,5X12,2 (8 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BEAT 12,5X12,1 (5 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BEAT 12,5X12,1 (9 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (8 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (6 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (5 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (7 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (9 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "KZR 12 GRAM(GROOVING)", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "KZR 7 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "KZR12 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "12,5X8X11,1 7GRAM DRILL", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "15X10X12,85 10 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "NMAX 8 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "12,6X10,6 6 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "12,6X10,6 8 GRAM", spek: "WHITE", harga: 5500, unit: "KG" },
        { part: "17X12,75X13,5 (12GR)", spek: "BLUE CR3+", harga: 5500, unit: "KG" },
        { part: "12,6X10,6", spek: "BLUE CR3+", harga: 5500, unit: "KG" },
        { part: "12,5X12,1 (5GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "12,5X12,1 (6GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BAUT 7GR 12,5X12,1", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "ROLLER GROVING (6GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "ROLLER GROVING (8GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "ROOLER GROVING (9GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "ROLLER GROVING (12GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "ROLLER (7GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "ROLLER (12GR)", spek: "AFTER PLAT", harga: 5500, unit: "KG" },
        { part: "MIO 7 GR GROVING", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 8 GR DRILL", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "KZR 10 GR", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "12,5 x 12,1( 8 GR) POLOS", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "REPAIR DRILL 12,5 x 11,1( 8 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "15x10x12,3 (11 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "12,5x11.1 (7 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "15x11,25 (9 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "17 x 11,3 x 15,5 (14 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "17 x 11,3 x 15,5 (15 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "15X10,7X12,3 (10 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "12,5X12,1 (6 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "12,5 x 12,1 (7 GR)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "KZR 14 GRAM", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "MIO 12,5X11,1 (8 GRAM)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "BEAT KARBU (6 GRAM)", spek: "YELLOW", harga: 5500, unit: "KG" },
        { part: "17x13,4 x 13,5 (10 GR)", spek: "YELLOW", harga: 5500, unit: "KG" }
    ],
    "PT. MEGA WAJA CORPORINDO": [
        { part: "JF/MS M6X15", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "F/ABH I #6X1 I", spek: "BLUE CR3+", harga: 3500, unit: "KG" },
        { part: "F/ABH I #6X1.1/4", spek: "BLUE CR3+", harga: 3500, unit: "KG" },
        { part: "F/ABH I #6X3/4", spek: "BLUE CR3+", harga: 3500, unit: "KG" },
        { part: "IDH/MS M7X30", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M4X70 (RETUR)", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JF/MS|M4X25|", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M3X6", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M4X50", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "PP/MS M3X6", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/KT M6X10", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "F/ABH #8X3", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M4X6", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M4X8", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "PPS/ABH #4X1/4", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "F/ABH #8X2", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "F/ABH #6X1 2604", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "JP/MS M3X15", spek: "PUTIH", harga: 2500, unit: "KG" },
        { part: "F/ABH #6X1.1/4", spek: "PUTIH", harga: 2500, unit: "KG" }
    ],
    "PT. RIZKY KARYA MAKMUR": [
        { part: "BAUT JCBC M6X50", spek: "BLUE CR3+", harga: 3500, unit: "KG" },
        { part: "06X15 MM", spek: "BLUE CR3+", harga: 3500, unit: "KG" }
    ],
    "PT. SAGA HIKARI TEKINDO SEJATI": [
        { part: "PW 2.68X6X0.5 CU", spek: "COOPER", harga: 22000, unit: "KG" },
        { part: "PW 2,68X6X0,5 CU", spek: "COOPER", harga: 22000, unit: "KG" },
        { part: "PW 2.68X8X0,5 CU", spek: "COOPER", harga: 22000, unit: "KG" }
    ],
    "CV. MNKAD AUTO SPORT": [
        { part: "METALIC GUIDE", spek: "BLUE CR3+", harga: 6500, unit: "KG" },
        { part: "METALIC BRIDLE", spek: "BLUE CR3+", harga: 6500, unit: "KG" },
        { part: "METALIC LOCKER", spek: "BLUE CR3+", harga: 6500, unit: "KG" },
        { part: "BLACK CLAMP", spek: "BLACK", harga: 20000, unit: "KG" },
        { part: "BAUT+RING+BUSHING", spek: "BLACK", harga: 20000, unit: "KG" }
    ],
    "PAK WINRASTO": [
        { part: "ALLL", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "B2", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "T4", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "A8", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "B3", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "BEHEL", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "A9", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "T9", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "A7", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "A10", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "T6", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "A1 & T7", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "T7", spek: "BLUE CR3+", harga: 6000, unit: "KG" },
        { part: "B2+B3", spek: "BLUE CR3+", harga: 6000, unit: "KG" }
    ],
    "PT. KURNIA BERDIKARI SEJAHTERA": [
        { part: "PIPA SHORT", spek: "BLUE CR3+", harga: 5000, unit: "KG" }
    ],
    "PT. CIKARANG PRESISI": [
        { part: "SPACER M6X70", spek: "BLUE", harga: 4000, unit: "KG" },
        { part: "INSULATION PIN 3X150MM", spek: "COPPER", harga: 4000, unit: "KG" },
        { part: "LONG ROOT NUT H8", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "LONG ROOT NUT H9", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "LONG ROOT NUT H12", spek: "BLUE CR3+", harga: 4000, unit: "KG" },
        { part: "LONG ROOT NUT H37", spek: "BLUE CR3+", harga: 4000, unit: "KG" }
    ],
    "CV. INDOSTAR SEJAHTERA": [
        { part: "HEXAGON 3/8 \"X5\"", spek: "HALF DRAT", harga: 2000, unit: "KG" },
        { part: "SELONGSONG 8", spek: "YELLOW", harga: 2000, unit: "KG" },
        { part: "SELONGSOG 10", spek: "YELLOW", harga: 2000, unit: "KG" },
        { part: "SELONGSONG M10", spek: "YELLOW", harga: 2000, unit: "KG" }
    ],
    "PT. MATRA RODA PIRANTI": [
        { part: "FRAME P3 LOUNGE CHAIR", spek: "BLUE CR3+", harga: 50000, unit: "PCS" },
        { part: "FRAME P3S CHAISE LOUNGE", spek: "BLUE CR3+", harga: 70000, unit: "PCS" },
        { part: "CHAIR LOUNGE", spek: "BLUE CR3+", harga: 70000, unit: "PCS" }
    ],
    "PT. ELYON INOVASI PERKASA": [
        { part: "ITEM 1", spek: "WHITE", harga: 5500, unit: "KG" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
    initCustomerDropdown();
    switchTab('PPIC');
});

// 1. Inisialisasi Datalist Customer
function initCustomerDropdown() {
    const custDatalist = document.getElementById('customerList');
    custDatalist.innerHTML = '';
    
    Object.keys(MASTER_DATA).forEach(cust => {
        const option = document.createElement('option');
        option.value = cust;
        custDatalist.appendChild(option);
    });
}

// 2. Handler Saat Customer Berubah / Diketik
function onCustomerChange() {
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach(row => updatePartDropdown(row));
}

// 3. Update Datalist Part berdasarkan Customer
function updatePartDropdown(row) {
    const cust = document.getElementById('customer').value;
    const partDatalist = row.querySelector('.partList');
    partDatalist.innerHTML = '';
    
    if (cust && MASTER_DATA[cust]) {
        const uniqueParts = [...new Set(MASTER_DATA[cust].map(i => i.part))];
        uniqueParts.forEach(partName => {
            const opt = document.createElement('option');
            opt.value = partName;
            partDatalist.appendChild(opt);
        });
    }
}

// 4. Update Datalist Spesifikasi berdasarkan Part
function onPartChange(inputElem) {
    const row = inputElem.closest('.item-row');
    const cust = document.getElementById('customer').value;
    const selectedPart = inputElem.value;
    const spekDatalist = row.querySelector('.spekList');

    spekDatalist.innerHTML = '';

    if (cust && selectedPart && MASTER_DATA[cust]) {
        const matchingItems = MASTER_DATA[cust].filter(i => i.part === selectedPart);
        matchingItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.spek;
            spekDatalist.appendChild(opt);
        });

        // Auto fill jika match tepat 1 item
        if (matchingItems.length === 1) {
            const spekInput = row.querySelector('.spesifikasi');
            spekInput.value = matchingItems[0].spek;
            onSpekChange(spekInput);
        }
    }
}

// 5. Mengisi Harga & Satuan Otomatis
function onSpekChange(inputElem) {
    const row = inputElem.closest('.item-row');
    const cust = document.getElementById('customer').value;
    const selectedPart = row.querySelector('.nama-barang').value;
    const selectedSpek = inputElem.value;

    const hargaInput = row.querySelector('.harga-satuan');
    const satuanSelect = row.querySelector('.satuan');

    if (cust && selectedPart && selectedSpek && MASTER_DATA[cust]) {
        const found = MASTER_DATA[cust].find(i => i.part === selectedPart && i.spek === selectedSpek);
        if (found) {
            if (hargaInput) hargaInput.value = found.harga;
            satuanSelect.value = (found.unit.toUpperCase() === 'PCS') ? 'Pcs' : 'Kg';
        }
    }

    updateFormTotals();
}

// 6. Menambah Baris Item Baru
function addItemRow() {
    const container = document.getElementById('itemContainer');
    const rowId = Date.now() + Math.floor(Math.random() * 1000);
    const divisi = document.getElementById('divisiAktif').value;
    const isPPIC = divisi === 'PPIC';

    const div = document.createElement('div');
    div.className = 'item-row bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2 relative';
    
    div.innerHTML = `
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-6">
                <input type="text" list="partList_${rowId}" class="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 nama-barang" placeholder="Pilih / Ketik Part..." oninput="onPartChange(this)" required>
                <datalist id="partList_${rowId}" class="partList"></datalist>
            </div>
            <div class="col-span-6">
                <input type="text" list="spekList_${rowId}" class="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 spesifikasi" placeholder="Pilih / Ketik Spesifikasi..." oninput="onSpekChange(this)" required>
                <datalist id="spekList_${rowId}" class="spekList"></datalist>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2 items-center">
            <input type="number" step="0.01" placeholder="Qty / Berat" oninput="updateFormTotals()" class="${isPPIC ? 'col-span-7' : 'col-span-3'} p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold jumlah-qty" required>
            <select class="${isPPIC ? 'col-span-3' : 'col-span-3'} p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold satuan">
                <option value="Kg">Kg</option>
                <option value="Pcs">Pcs</option>
            </select>
            ${!isPPIC ? `<input type="number" placeholder="Harga" oninput="updateFormTotals()" class="col-span-4 p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-red-950 harga-satuan" required>` : ''}
            <button type="button" onclick="removeItemRow(this)" class="col-span-2 bg-gray-200 hover:bg-red-100 text-red-600 p-2 rounded-lg text-xs font-bold transition">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(div);
    updatePartDropdown(div);
}

// 7. Menghapus Baris Item Form Input
function removeItemRow(btn) {
    const rows = document.querySelectorAll('.item-row');
    if (rows.length > 1) {
        btn.closest('.item-row').remove();
        updateFormTotals();
    } else {
        alert('Minimal harus ada 1 item barang!');
    }
}

// 8. Hitung Grand Total
function updateFormTotals() {
    let grandTotal = 0;

    document.querySelectorAll('.item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.jumlah-qty').value) || 0;
        const hargaElem = row.querySelector('.harga-satuan');
        const harga = hargaElem ? (parseFloat(hargaElem.value) || 0) : 0;
        grandTotal += (qty * harga);
    });

    const totalElem = document.getElementById('formGrandTotal');
    if (totalElem) {
        totalElem.innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
    }
}

// 9. Reset Kontainer Baris
function resetItemContainer() {
    const container = document.getElementById('itemContainer');
    container.innerHTML = '';
    addItemRow();
}

// Reset Mode Edit ke Mode Normal (Simpan Baru)
function resetEditMode() {
    editModeNoSurat = null;
    const btnSubmit = document.getElementById('btnSubmit');
    const divisi = document.getElementById('divisiAktif').value;
    
    if (divisi === 'PPIC') {
        btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Surat Jalan Masuk';
    } else {
        btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Simpan Surat Jalan Keluar';
    }
}

// 10. Navigasi Tab (PPIC / Marketing)
function switchTab(divisi) {
    const tabPpic = document.getElementById('tabPpic');
    const tabMarketing = document.getElementById('tabMarketing');
    const formHeaderBg = document.getElementById('formHeaderBg');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const badgeDivisi = document.getElementById('badgeDivisi');
    const btnSubmit = document.getElementById('btnSubmit');
    const tableTitle = document.getElementById('tableTitle');
    const formTotalContainer = document.getElementById('formTotalContainer');
    const thHarga = document.getElementById('thHarga');
    const formLabelBarang = document.getElementById('formLabelBarang');

    document.getElementById('divisiAktif').value = divisi;

    if (divisi === 'PPIC') {
        document.getElementById('tipeAktif').value = 'MASUK';
        tabPpic.className = "px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 bg-white text-red-900 shadow-md";
        tabMarketing.className = "px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 flex items-center gap-2 text-red-100 hover:text-white hover:bg-red-800/60";
        formHeaderBg.className = "bg-gradient-to-r from-red-700 to-red-600 px-6 py-4 text-white flex justify-between items-center";
        
        formTitle.innerHTML = '<i class="fa-solid fa-file-pen"></i> Form Surat Jalan Masuk';
        formSubtitle.innerText = "Input data transaksi penerimaan barang";
        badgeDivisi.innerText = "MASUK";
        btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Surat Jalan Masuk';
        btnSubmit.className = "w-full mt-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-red-700/30 flex items-center justify-center gap-2";
        tableTitle.innerHTML = '<i class="fa-solid fa-clock-rotate-left text-red-600"></i> Riwayat Surat Jalan Masuk';

        document.getElementById('no_surat').placeholder = "SJ-IN/2026/001";

        if (formTotalContainer) formTotalContainer.style.display = 'none';
        if (thHarga) thHarga.style.display = 'none';
        if (formLabelBarang) formLabelBarang.innerHTML = '<i class="fa-solid fa-boxes-stacked mr-1 text-red-600"></i> Detail Barang';
    } else {
        document.getElementById('tipeAktif').value = 'KELUAR';
        tabMarketing.className = "px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 bg-white text-red-900 shadow-md";
        tabPpic.className = "px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 flex items-center gap-2 text-red-100 hover:text-white hover:bg-red-800/60";
        formHeaderBg.className = "bg-gradient-to-r from-red-900 to-red-800 px-6 py-4 text-white flex justify-between items-center";

        formTitle.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Form Surat Jalan Keluar';
        formSubtitle.innerText = "Input data transaksi pengiriman barang";
        badgeDivisi.innerText = "KELUAR";
        btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Simpan Surat Jalan Keluar';
        btnSubmit.className = "w-full mt-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-lg shadow-red-900/30 flex items-center justify-center gap-2";
        tableTitle.innerHTML = '<i class="fa-solid fa-clock-rotate-left text-red-700"></i> Riwayat Surat Jalan Keluar';

        document.getElementById('no_surat').placeholder = "SJ-OUT/2026/001";

        if (formTotalContainer) formTotalContainer.style.display = 'flex';
        if (thHarga) thHarga.style.display = 'table-cell';
        if (formLabelBarang) formLabelBarang.innerHTML = '<i class="fa-solid fa-boxes-stacked mr-1 text-red-600"></i> Detail Barang & Harga';
    }

    resetEditMode();
    resetItemContainer();
    loadTableData();
}

// 11. Muat Data Tabel dari Server (Posisi Tanggal & No Surat ditukar)
async function loadTableData() {
    try {
        const divisi = document.getElementById('divisiAktif').value;
        const res = await fetch(`/api/surat-jalan?divisi=${divisi}`);
        
        if (!res.ok) throw new Error('Gagal mengambil data dari server');

        const data = await res.json();
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        document.getElementById('totalBadge').innerText = `${data.length} Dokumen`;

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${divisi === 'PPIC' ? '8' : '9'}" class="p-8 text-center text-gray-400">
                        <i class="fa-solid fa-folder-open text-3xl mb-2 text-red-200 block"></i>
                        Belum ada data surat jalan terdaftar
                    </td>
                </tr>`;
            return;
        }

        data.forEach(item => {
            const totalHargaSJ = item.items ? item.items.reduce((acc, curr) => acc + ((parseFloat(curr.qty) || 0) * (parseFloat(curr.harga) || 0)), 0) : 0;
            
            const namaBarangList = item.items ? item.items.map(i => i.nama_barang || '-').join('<br>') : '-';
            const spesifikasiList = item.items ? item.items.map(i => i.spesifikasi || '-').join('<br>') : '-';

            const qtyPcsList = item.items ? item.items.map(i => {
                const isPcs = (i.satuan || '').toLowerCase() === 'pcs';
                return isPcs ? `${i.qty || 0} Pcs` : '-';
            }).join('<br>') : '-';

            const qtyKgList = item.items ? item.items.map(i => {
                const isKg = (i.satuan || '').toLowerCase() === 'kg';
                return isKg ? `${i.qty || 0} Kg` : '-';
            }).join('<br>') : '-';

            tbody.innerHTML += `
                <tr class="bg-white hover:bg-red-50/50 transition-colors border-b border-gray-100 search-row">
                    <td class="p-3 text-gray-600 align-top">${item.tanggal || '-'}</td>
                    <td class="p-3 font-bold text-red-950 align-top">${item.no_surat || '-'}</td>
                    <td class="p-3 font-medium text-gray-800 align-top">${item.customer || item.mitra || '-'}</td>
                    <td class="p-3 text-gray-800 font-semibold align-top">${namaBarangList}</td>
                    <td class="p-3 text-gray-700 font-bold text-center align-top">${qtyPcsList}</td>
                    <td class="p-3 text-gray-700 font-bold text-center align-top">${qtyKgList}</td>
                    <td class="p-3 text-gray-600 align-top">${spesifikasiList}</td>
                    ${divisi !== 'PPIC' ? `<td class="p-3 text-right font-black text-red-900 align-top">Rp ${totalHargaSJ.toLocaleString('id-ID')}</td>` : ''}
                    <td class="p-3 text-center align-top">
                        <div class="flex items-center justify-center gap-1">
                            <button onclick="editSuratJalan('${encodeURIComponent(item.no_surat)}')" class="bg-amber-100 hover:bg-amber-600 text-amber-600 hover:text-white p-2 rounded-lg transition duration-200" title="Edit Surat Jalan">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onclick="deleteSuratJalan('${encodeURIComponent(item.no_surat)}')" class="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg transition duration-200" title="Hapus Surat Jalan">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Gagal memuat data tabel:", err);
    }
}

// Fungsi Memuat Data ke Form dalam Mode Edit
async function editSuratJalan(noSurat) {
    const decodedNoSurat = decodeURIComponent(noSurat);
    const divisi = document.getElementById('divisiAktif').value;

    try {
        const res = await fetch(`/api/surat-jalan?divisi=${divisi}`);
        const data = await res.json();
        const targetData = data.find(item => item.no_surat === decodedNoSurat);

        if (!targetData) {
            alert('Data surat jalan tidak ditemukan.');
            return;
        }

        editModeNoSurat = targetData.no_surat;

        // Populate Form
        document.getElementById('tanggal').value = targetData.tanggal || '';
        document.getElementById('no_surat').value = targetData.no_surat || '';
        document.getElementById('customer').value = targetData.customer || targetData.mitra || '';

        // Reset & Populate Item
        const container = document.getElementById('itemContainer');
        container.innerHTML = '';

        if (targetData.items && targetData.items.length > 0) {
            targetData.items.forEach(item => {
                addItemRow();
                const lastRow = container.querySelector('.item-row:last-child');
                
                lastRow.querySelector('.nama-barang').value = item.nama_barang || '';
                onPartChange(lastRow.querySelector('.nama-barang'));

                lastRow.querySelector('.spesifikasi').value = item.spesifikasi || '';
                onSpekChange(lastRow.querySelector('.spesifikasi'));

                lastRow.querySelector('.jumlah-qty').value = item.qty || 0;
                lastRow.querySelector('.satuan').value = item.satuan || 'Kg';

                const hargaInput = lastRow.querySelector('.harga-satuan');
                if (hargaInput) {
                    hargaInput.value = item.harga || 0;
                }
            });
        } else {
            addItemRow();
        }

        updateFormTotals();

        // Ubah Tombol Submit
        const btnSubmit = document.getElementById('btnSubmit');
        btnSubmit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Surat Jalan';
        
        // Scroll Halus Ke Form
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error("Gagal mengambil detail data:", err);
        alert('Gagal mengambil detail data surat jalan.');
    }
}

// 12. Fungsi Hapus Data Surat Jalan dari Riwayat
async function deleteSuratJalan(noSurat) {
    const decodedNoSurat = decodeURIComponent(noSurat);
    if (!confirm(`Apakah Anda yakin ingin menghapus surat jalan: ${decodedNoSurat}?`)) {
        return;
    }

    try {
        const res = await fetch(`/api/surat-jalan/${noSurat}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message || 'Data berhasil dihapus!');
            if (editModeNoSurat === decodedNoSurat) {
                resetEditMode();
                document.getElementById('formSuratJalan').reset();
                resetItemContainer();
            }
            loadTableData();
        } else {
            alert(data.message || 'Gagal menghapus data.');
        }
    } catch (err) {
        console.error("Error saat menghapus data:", err);
        alert('Terjadi kesalahan koneksi ke server.');
    }
}

// 13. Filter Pencarian Tabel
function filterTable() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('.search-row');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// 14. Ekspor Laporan
function exportExcel() {
    const divisi = document.getElementById('divisiAktif').value;
    window.open(`/api/export/excel?divisi=${divisi}`, '_blank');
}

function exportRekapBulanan() {
    const divisi = document.getElementById('divisiAktif').value;
    const bulanFormat = new Date().toISOString().slice(0, 7);
    const bulanInput = prompt("Masukkan Bulan Rekap (Format YYYY-MM):", bulanFormat);
    
    if (bulanInput) {
        window.open(`/api/export/rekap-bulanan?divisi=${divisi}&bulan=${bulanInput}`, '_blank');
    }
}

// 15. Event Listener Submit Form
document.getElementById('formSuratJalan').addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemRows = document.querySelectorAll('.item-row');
    const items = [];

    itemRows.forEach(row => {
        const hargaElem = row.querySelector('.harga-satuan');
        
        items.push({
            nama_barang: row.querySelector('.nama-barang')?.value || '',
            spesifikasi: row.querySelector('.spesifikasi')?.value || '',
            qty: parseFloat(row.querySelector('.jumlah-qty')?.value) || 0,
            satuan: row.querySelector('.satuan')?.value || 'Kg',
            harga: hargaElem ? (parseFloat(hargaElem.value) || 0) : 0
        });
    });

    const payload = {
        divisi: document.getElementById('divisiAktif').value,
        tipe: document.getElementById('tipeAktif').value,
        tanggal: document.getElementById('tanggal').value,
        no_surat: document.getElementById('no_surat').value,
        customer: document.getElementById('customer').value,
        items: items
    };

    const isEdit = editModeNoSurat !== null;
    const url = isEdit ? `/api/surat-jalan/${encodeURIComponent(editModeNoSurat)}` : '/api/surat-jalan';
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const resData = await res.json();

        if (res.ok) {
            alert(isEdit ? 'Surat jalan berhasil diperbarui!' : 'Surat jalan berhasil disimpan!');
            document.getElementById('formSuratJalan').reset();
            document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
            initCustomerDropdown();
            resetEditMode();
            resetItemContainer();
            loadTableData();
        } else {
            alert(resData.message || 'Gagal menyimpan data.');
        }
    } catch (err) {
        console.error('Error saat menyimpan:', err);
        alert('Terjadi kesalahan koneksi server.');
    }
});