const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path Penyimpanan File Database JSON dan File Excel
const DATA_FILE = path.join(__dirname, 'database.json');
const EXCEL_FILE = path.join(__dirname, 'Data_Surat_Jalan.xlsx');

// Helper: Membaca data dari file JSON
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData || '[]');
  } catch (err) {
    console.error("Gagal membaca database.json:", err);
    return [];
  }
}

// Helper: Menyimpan data ke file JSON
function saveDatabase(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Gagal menyimpan ke database.json:", err);
  }
}

// Helper untuk membersihkan nama Customer agar valid sebagai Nama Sheet Excel
function sanitizeSheetName(name) {
  if (!name) return "CUSTOMER";
  let clean = name.replace(/[:\\/?*\[\]]/g, '').trim();
  if (clean.length > 30) {
    clean = clean.substring(0, 30);
  }
  return clean || "CUSTOMER";
}

// =========================================================================
// MEKANISME OTOMATIS SIMPAN KE EXCEL (FILE SAVE)
// =========================================================================
async function syncToExcelFile() {
  try {
    const dataFiltered = loadDatabase();
    const workbook = new ExcelJS.Workbook();

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

        ws.columns = [
            { key: 'colA', width: 6 },
            { key: 'colB', width: 35 },
            { key: 'colC', width: 15 },
            { key: 'colD', width: 25 },
            { key: 'colE', width: 18 }
        ];

        let currentRow = 1;

        for (const [tanggal, listSJ] of Object.entries(tanggalMap)) {
            for (const sj of listSJ) {
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

                ws.mergeCells(`B${currentRow+3}:C${currentRow+3}`);
                const rTitle = ws.getCell(`B${currentRow+3}`);
                rTitle.value = `SURAT JALAN (${sj.divisi || 'PPIC'})`;
                rTitle.font = { name: 'Arial', size: 12, bold: true, underline: true };
                rTitle.alignment = { horizontal: 'center' };

                ws.mergeCells(`B${currentRow+4}:C${currentRow+4}`);
                const rNoSJ = ws.getCell(`B${currentRow+4}`);
                rNoSJ.value = `No. ${sj.no_surat || '-'}`;
                rNoSJ.font = { name: 'Arial', size: 10, bold: true };
                rNoSJ.alignment = { horizontal: 'center' };

                currentRow += 6;

                ws.getCell(`A${currentRow}`).value = "Kepada Yth.";
                ws.getCell(`B${currentRow}`).value = `: ${custName}`;
                ws.getCell(`B${currentRow}`).font = { bold: true };

                ws.getCell(`C${currentRow}`).value = "Tanggal";
                ws.getCell(`D${currentRow}`).value = `: ${tanggal}`;
                ws.getCell(`D${currentRow}`).font = { bold: true };

                ws.getCell(`A${currentRow+1}`).value = "Dengan hormat,";
                ws.getCell(`A${currentRow+2}`).value = "Bersama surat ini kami mengirimkan barang dengan perincian sebagai berikut :";

                currentRow += 4;

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

                currentRow += 4;
            }
        }
    }

    // Menulis / Update File Excel secara otomatis di Server
    await workbook.xlsx.writeFile(EXCEL_FILE);
    console.log("File Excel 'Data_Surat_Jalan.xlsx' berhasil diupdate!");
  } catch (err) {
    console.error("Gagal menyinkronkan ke Excel file:", err);
  }
}

// API 1: GET ALL SURAT JALAN (BERDASARKAN DIVISI)
app.get('/api/surat-jalan', (req, res) => {
  try {
    const { divisi } = req.query;
    let databaseSuratJalan = loadDatabase();
    
    if (divisi) {
      databaseSuratJalan = databaseSuratJalan.filter(item => item.divisi === divisi);
    }
    
    return res.status(200).json(databaseSuratJalan);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 2: POST / SIMPAN SURAT JALAN BARU
app.post('/api/surat-jalan', async (req, res) => {
  try {
    const dataBaru = req.body;

    if (!dataBaru.no_surat) {
      return res.status(400).json({ success: false, message: 'Nomor surat jalan wajib diisi!' });
    }

    let databaseSuratJalan = loadDatabase();

    const ada = databaseSuratJalan.some(item => item.no_surat === dataBaru.no_surat);
    if (ada) {
      return res.status(400).json({ success: false, message: 'Nomor Surat Jalan sudah terdaftar!' });
    }

    databaseSuratJalan.push(dataBaru);
    saveDatabase(databaseSuratJalan);

    // Otomatis Simpan / Update File Excel
    await syncToExcelFile();

    return res.status(201).json({
      success: true,
      message: 'Data berhasil disimpan dan otomatis ter-update di File Excel!',
      data: dataBaru
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 3: PUT / EDIT SURAT JALAN BERDASARKAN NO SURAT
app.put('/api/surat-jalan/:no_surat', async (req, res) => {
  try {
    const { no_surat } = req.params;
    const decodedNoSurat = decodeURIComponent(no_surat);
    const dataUpdate = req.body;

    let databaseSuratJalan = loadDatabase();
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

    saveDatabase(databaseSuratJalan);

    // Otomatis Simpan / Update File Excel
    await syncToExcelFile();

    return res.status(200).json({
      success: true,
      message: 'Data surat jalan berhasil diperbarui dan disinkronkan ke Excel!',
      data: databaseSuratJalan[index]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 4: DELETE SURAT JALAN BERDASARKAN NO SURAT
app.delete('/api/surat-jalan/:no_surat', async (req, res) => {
  try {
    const { no_surat } = req.params;
    const decodedNoSurat = decodeURIComponent(no_surat);

    let databaseSuratJalan = loadDatabase();
    const index = databaseSuratJalan.findIndex(item => item.no_surat === decodedNoSurat);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Data surat jalan tidak ditemukan!' });
    }

    databaseSuratJalan.splice(index, 1);
    saveDatabase(databaseSuratJalan);

    // Otomatis Simpan / Update File Excel
    await syncToExcelFile();

    return res.status(200).json({
      success: true,
      message: 'Data berhasil dihapus dari sistem dan Excel!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 5: DOWNLOAD FILE EXCEL
app.get('/api/export/excel', (req, res) => {
  try {
    if (fs.existsSync(EXCEL_FILE)) {
      res.download(EXCEL_FILE, `Data_Surat_Jalan_${Date.now()}.xlsx`);
    } else {
      res.status(404).json({ success: false, message: 'File Excel belum tersedia.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
}

module.exports = app;