const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json());
app.use(express.static('public'));

function getData() {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/surat-jalan', (req, res) => {
    const { divisi } = req.query;
    let data = getData();
    if (divisi) data = data.filter(d => d.divisi === divisi);
    res.json(data);
});

app.post('/api/surat-jalan', (req, res) => {
    const data = getData();
    const newItem = { id: Date.now(), ...req.body };
    data.push(newItem);
    saveData(data);
    res.json({ message: 'Berhasil disimpan', data: newItem });
});

// EKSPOR SEMUA DATA KE EXCEL
app.get('/api/export/excel', async (req, res) => {
    const { divisi } = req.query;
    let data = getData();
    if (divisi) data = data.filter(d => d.divisi === divisi);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Surat Jalan');

    worksheet.columns = [
        { header: 'No. Surat Jalan', key: 'no_surat', width: 20 },
        { header: 'Tanggal', key: 'tanggal', width: 15 },
        { header: 'Customer', key: 'customer', width: 25 },
        { header: 'Nama Barang / Part', key: 'nama_barang', width: 30 },
        { header: 'Spesifikasi', key: 'spesifikasi', width: 20 },
        { header: 'Qty / Berat', key: 'qty', width: 12 },
        { header: 'Unit / Satuan', key: 'satuan', width: 12 },
        { header: 'Harga / Satuan (Rp)', key: 'harga', width: 20 },
        { header: 'Total Harga (Rp)', key: 'subtotal', width: 20 }
    ];

    data.forEach(sj => {
        sj.items.forEach(item => {
            const qty = parseFloat(item.qty) || 0;
            const harga = parseFloat(item.harga) || 0;
            worksheet.addRow({
                no_surat: sj.no_surat,
                tanggal: sj.tanggal,
                customer: sj.customer,
                nama_barang: item.nama_barang,
                spesifikasi: item.spesifikasi,
                qty: qty,
                satuan: item.satuan,
                harga: harga,
                subtotal: qty * harga
            });
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Surat_Jalan_${divisi}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
});

// EKSPOR REKAP LAPORAN BULANAN KE EXCEL
app.get('/api/export/rekap-bulanan', async (req, res) => {
    const { divisi, bulan } = req.query;
    let data = getData();

    if (divisi) data = data.filter(d => d.divisi === divisi);
    if (bulan) data = data.filter(d => d.tanggal && d.tanggal.startsWith(bulan));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Rekap_${bulan}`);

    worksheet.addRow([`REKAP LAPORAN BULANAN SURAT JALAN (${divisi})`]);
    worksheet.addRow([`PERIODE BULAN: ${bulan}`]);
    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
        'No. Surat Jalan', 'Tanggal', 'Customer', 
        'Nama Barang', 'Spesifikasi', 'Qty', 'Satuan', 'Harga/Satuan (Rp)', 'Total (Rp)'
    ]);

    headerRow.font = { bold: true };

    let grandTotalRp = 0;

    data.forEach(sj => {
        sj.items.forEach(item => {
            const qty = parseFloat(item.qty) || 0;
            const harga = parseFloat(item.harga) || 0;
            const subtotal = qty * harga;
            grandTotalRp += subtotal;

            worksheet.addRow([
                sj.no_surat,
                sj.tanggal,
                sj.customer,
                item.nama_barang,
                item.spesifikasi,
                qty,
                item.satuan,
                harga,
                subtotal
            ]);
        });
    });

    worksheet.addRow([]);
    const totalRow = worksheet.addRow(['', '', '', '', '', '', '', 'GRAND TOTAL (Rp):', grandTotalRp]);
    totalRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Rekap_Bulanan_${divisi}_${bulan}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});