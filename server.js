const express = require('express');
const cors = require('cors');
const path = require('path');
const ExcelJS = require('exceljs'); // Menggunakan library exceljs yang sudah ada di package.json

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database (Contoh Simpanan Data Temporary)
let databaseSuratJalan = [];

// Helper untuk membersihkan nama Customer agar valid sebagai Nama Sheet Excel (Maks 31 Karakter, Tanpa Karakter Khusus)
function sanitizeSheetName(name) {
    if (!name) return "CUSTOMER";
    let clean = name.replace(/[:\\/?*\[\]]/g, '').trim();
    if (clean.length > 30) {
        clean = clean.substring(0, 30);
    }
    return clean || "CUSTOMER";
}

// API 1: GET ALL SURAT JALAN (BERDASARKAN DIVISI)
app.get('/api/surat-jalan', (req, res) => {
  try {
    const { divisi } = req.query; // 'PPIC' atau 'MARKETING'
    let result = databaseSuratJalan;
    
    if (divisi) {
      result = databaseSuratJalan.filter(item => item.divisi === divisi);
    }
    
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 2: POST / SIMPAN SURAT JALAN BARU
app.post('/api/surat-jalan', (req, res) => {
  try {
    const dataBaru = req.body;

    if (!dataBaru.no_surat) {
      return res.status(400).json({ success: false, message: 'Nomor surat jalan wajib diisi!' });
    }

    // Cek duplikasi nomor surat jalan
    const ada = databaseSuratJalan.some(item => item.no_surat === dataBaru.no_surat);
    if (ada) {
      return res.status(400).json({ success: false, message: 'Nomor Surat Jalan sudah terdaftar!' });
    }

    databaseSuratJalan.push(dataBaru);

    return res.status(201).json({
      success: true,
      message: 'Data berhasil disimpan!',
      data: dataBaru
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 3: PUT / EDIT SURAT JALAN BERDASARKAN NO SURAT
app.put('/api/surat-jalan/:no_surat', (req, res) => {
  try {
    const { no_surat } = req.params;
    const decodedNoSurat = decodeURIComponent(no_surat);
    const dataUpdate = req.body;

    const index = databaseSuratJalan.findIndex(item => item.no_surat === decodedNoSurat);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Data surat jalan tidak ditemukan!' });
    }

    if (dataUpdate.no_surat !== decodedNoSurat) {
      const adaDuplikat = databaseSuratJalan.some(item => item.no_surat === dataUpdate.no_surat);
      if (adaDuplikat) {
        return res.status(400).json({ success: false, message: 'Nomor Surat Jalan yang baru sudah digunakan!' });
      }
    }

    databaseSuratJalan[index] = {
      ...databaseSuratJalan[index],
      ...dataUpdate
    };

    return res.status(200).json({
      success: true,
      message: 'Data surat jalan berhasil diperbarui!',
      data: databaseSuratJalan[index]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 4: DELETE SURAT JALAN BERDASARKAN NO SURAT
app.delete('/api/surat-jalan/:no_surat', (req, res) => {
  try {
    const { no_surat } = req.params;
    const decodedNoSurat = decodeURIComponent(no_surat);

    const index = databaseSuratJalan.findIndex(item => item.no_surat === decodedNoSurat);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Data surat jalan tidak ditemukan!' });
    }

    databaseSuratJalan.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Data berhasil dihapus!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// FITUR TAMBAHAN: EKSPOR EXCEL SESUAI FORMAT SURAT JALAN PADA GAMBAR
// =========================================================================
async function generateExcelSuratJalan(dataFiltered, res) {
    const workbook = new ExcelJS.Workbook();

    // Grouping Data: Per Customer -> Per Tanggal
    const customerGroup = {};
    dataFiltered.forEach(sj => {
        const custName = sj.customer || sj.mitra || "TANPA CUSTOMER";
        if (!customerGroup[custName]) {
            customerGroup[custName] = {};
        }
        const tgl = sj.tanggal || "TANPA TANGGAL";
        if (!customerGroup[custName][tgl]) {
            customerGroup[custName][tgl] = [];
        }
        customerGroup[custName][tgl].push(sj);
    });

    const usedSheetNames = new Set();

    // Loop Setiap Customer (Membuat Sheet Baru)
    for (const [custName, tanggalMap] of Object.entries(customerGroup)) {
        let baseSheetName = sanitizeSheetName(custName);
        let sheetName = baseSheetName;
        let counter = 1;

        while (usedSheetNames.has(sheetName)) {
            sheetName = `${baseSheetName}_${counter}`;
            counter++;
        }
        usedSheetNames.add(sheetName);

        const ws = workbook.addWorksheet(sheetName);

        // Pengaturan Lebar Kolom
        ws.columns = [
            { key: 'colA', width: 6 },   // No
            { key: 'colB', width: 35 },  // Nama Barang
            { key: 'colC', width: 15 },  // Jumlah
            { key: 'colD', width: 25 },  // Keterangan / Spek
            { key: 'colE', width: 18 }   // Harga / Info Tambahan
        ];

        let currentRow = 1;

        // Loop Per Tanggal untuk Customer Ini
        for (const [tanggal, listSJ] of Object.entries(tanggalMap)) {
            for (const sj of listSJ) {
                // 1. KOP PERUSAHAAN (Sesuai Gambar)
                ws.mergeCells(`A${currentRow}:D${currentRow}`);
                const r1 = ws.getCell(`A${currentRow}`);
                r1.value = "PT. MEGUMI BRAYAN INDONESIA";
                r1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF990000' } };

                ws.mergeCells(`A${currentRow+1}:D${currentRow+1}`);
                ws.getCell(`A${currentRow+1}`).value = "Jalan Sampora, Perum GMI D3/34, Bekasi";
                ws.getCell(`A${currentRow+1}`).font = { name: 'Arial', size: 9 };

                ws.mergeCells(`A${currentRow+2}:D${currentRow+2}`);
                ws.getCell(`A${currentRow+2}`).value = "e-mail : mktmegumibrayan@gmail.com | Telp : +62 878-9631-2028";
                ws.getCell(`A${currentRow+2}`).font = { name: 'Arial', size: 9 };

                // Judul Dokumen & No Surat Jalan
                ws.mergeCells(`B${currentRow+3}:C${currentRow+3}`);
                const rTitle = ws.getCell(`B${currentRow+3}`);
                rTitle.value = "SURAT JALAN";
                rTitle.font = { name: 'Arial', size: 12, bold: true, underline: true };
                rTitle.alignment = { horizontal: 'center' };

                ws.mergeCells(`B${currentRow+4}:C${currentRow+4}`);
                const rNoSJ = ws.getCell(`B${currentRow+4}`);
                rNoSJ.value = `No. ${sj.no_surat || '-'}`;
                rNoSJ.font = { name: 'Arial', size: 10, bold: true };
                rNoSJ.alignment = { horizontal: 'center' };

                currentRow += 6;

                // 2. HEADER KEPADA YTH & TANGGAL
                ws.getCell(`A${currentRow}`).value = "Kepada Yth.";
                ws.getCell(`B${currentRow}`).value = `: ${custName}`;
                ws.getCell(`B${currentRow}`).font = { bold: true };

                ws.getCell(`C${currentRow}`).value = "Tanggal";
                ws.getCell(`D${currentRow}`).value = `: ${tanggal}`;
                ws.getCell(`D${currentRow}`).font = { bold: true };

                ws.getCell(`A${currentRow+1}`).value = "Dengan hormat,";
                ws.getCell(`A${currentRow+2}`).value = "Bersama surat ini kami mengirimkan barang dengan perincian sebagai berikut :";

                currentRow += 4;

                // 3. TABEL HEADER BARANG
                const headerRow = ws.getRow(currentRow);
                headerRow.values = ["No", "Nama Barang", "Jumlah", "Keterangan / Spesifikasi"];
                if (sj.divisi === 'MARKETING') {
                    headerRow.values = ["No", "Nama Barang", "Jumlah", "Keterangan", "Total Harga"];
                }

                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF800000' } };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    cell.border = {
                        top: { style: 'thin' }, left: { style: 'thin' },
                        bottom: { style: 'thin' }, right: { style: 'thin' }
                    };
                });

                currentRow++;

                // 4. ISI BARANG SURAT JALAN
                let grandTotal = 0;
                if (sj.items && sj.items.length > 0) {
                    sj.items.forEach((item, idx) => {
                        const itemRow = ws.getRow(currentRow);
                        const qtyText = `${item.qty || 0} ${item.satuan || ''}`;
                        const lineTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.harga) || 0);
                        grandTotal += lineTotal;

                        if (sj.divisi === 'MARKETING') {
                            itemRow.values = [
                                idx + 1,
                                item.nama_barang || '-',
                                qtyText,
                                item.spesifikasi || '-',
                                `Rp ${lineTotal.toLocaleString('id-ID')}`
                            ];
                        } else {
                            itemRow.values = [
                                idx + 1,
                                item.nama_barang || '-',
                                qtyText,
                                item.spesifikasi || '-'
                            ];
                        }

                        itemRow.eachCell((cell, colNumber) => {
                            cell.border = {
                                top: { style: 'thin' }, left: { style: 'thin' },
                                bottom: { style: 'thin' }, right: { style: 'thin' }
                            };
                            if (colNumber === 1 || colNumber === 3) {
                                cell.alignment = { horizontal: 'center' };
                            }
                        });
                        currentRow++;
                    });
                } else {
                    ws.getRow(currentRow).values = [1, "-", "-", "-"];
                    currentRow++;
                }

                if (sj.divisi === 'MARKETING') {
                    const totalRow = ws.getRow(currentRow);
                    totalRow.values = ["", "Grand Total", "", "", `Rp ${grandTotal.toLocaleString('id-ID')}`];
                    ws.mergeCells(`B${currentRow}:D${currentRow}`);
                    totalRow.getCell(2).font = { bold: true };
                    totalRow.getCell(5).font = { bold: true };
                    currentRow++;
                }

                currentRow += 1;
                ws.getCell(`A${currentRow}`).value = "Mohon diperiksa kondisi barang dan diterima.";

                // 5. TANDA TANGAN (Sesuai Gambar)
                currentRow += 2;
                ws.getCell(`A${currentRow}`).value = "Yang Menerima,";
                ws.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

                ws.getCell(`D${currentRow}`).value = `Bekasi, ${tanggal}`;
                ws.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };

                ws.getCell(`D${currentRow+1}`).value = "Hormat kami,";
                ws.getCell(`D${currentRow+1}`).alignment = { horizontal: 'center' };

                currentRow += 4;
                ws.getCell(`A${currentRow}`).value = "( ............................ )";
                ws.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

                ws.getCell(`D${currentRow}`).value = "PT. MEGUMI BRAYAN INDONESIA";
                ws.getCell(`D${currentRow}`).font = { bold: true };
                ws.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };

                // Pembatas antar surat jalan jika ada lebih dari 1 di tanggal yang sama
                currentRow += 4;
            }
        }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Export_SuratJalan_${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
}

// API 5: EKSPOR SEMUA DATA KE EXCEL
app.get('/api/export/excel', async (req, res) => {
    try {
        const { divisi } = req.query;
        let dataFiltered = databaseSuratJalan;
        if (divisi) {
            dataFiltered = databaseSuratJalan.filter(item => item.divisi === divisi);
        }
        await generateExcelSuratJalan(dataFiltered, res);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// API 6: EKSPOR REKAP BULANAN KE EXCEL
app.get('/api/export/rekap-bulanan', async (req, res) => {
    try {
        const { divisi, bulan } = req.query; // Format bulan: YYYY-MM
        let dataFiltered = databaseSuratJalan;

        if (divisi) {
            dataFiltered = dataFiltered.filter(item => item.divisi === divisi);
        }

        if (bulan) {
            dataFiltered = dataFiltered.filter(item => item.tanggal && item.tanggal.startsWith(bulan));
        }

        await generateExcelSuratJalan(dataFiltered, res);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;