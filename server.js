const express = require('express');
const cors = require('cors');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Menaikkan limit JSON body parser agar dapat menerima string foto (Base64) dari kamera
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database (Aman untuk Vercel Serverless)
let databaseSuratJalan = [];

// Helper untuk membersihkan nama Sheet Excel
function sanitizeSheetName(name) {
  if (!name) return "CUSTOMER";
  let clean = name.replace(/[:\\/?*\[\]]/g, '').trim();
  if (clean.length > 30) {
    clean = clean.substring(0, 30);
  }
  return clean || "CUSTOMER";
}

// Helper Generator Excel File (On-the-Fly Buffer)
async function generateExcelBuffer(divisiFilter) {
  const workbook = new ExcelJS.Workbook();
  let dataFiltered = [...databaseSuratJalan];

  if (divisiFilter) {
    dataFiltered = dataFiltered.filter(item => item.divisi === divisiFilter);
  }

  const customerGroup = {};
  dataFiltered.forEach(sj => {
    const custName = sj.customer || sj.mitra || "TANPA CUSTOMER";
    if (!customerGroup[custName]) customerGroup[custName] = {};
    const tgl = sj.tanggal || "TANPA TANGGAL";
    if (!customerGroup[custName][tgl]) customerGroup[custName][tgl] = [];
    customerGroup[custName][tgl].push(sj);
  });

  const usedSheetNames = new Set();

  if (Object.keys(customerGroup).length === 0) {
    const ws = workbook.addWorksheet("DATA SURAT JALAN");
    ws.addRow(["Belum ada data surat jalan terdaftar"]);
  } else {
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
        { key: 'colE', width: 25 },
        { key: 'colF', width: 18 }
      ];

      let currentRow = 1;

      for (const [tanggal, listSJ] of Object.entries(tanggalMap)) {
        for (const sj of listSJ) {
          ws.mergeCells(`A${currentRow}:E${currentRow}`);
          const r1 = ws.getCell(`A${currentRow}`);
          r1.value = "PT. MEGUMI BRAYAN INDONESIA";
          r1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF990000' } };

          ws.mergeCells(`A${currentRow+1}:E${currentRow+1}`);
          ws.getCell(`A${currentRow+1}`).value = "Jalan Sampora, Perum GMI D3/34, Bekasi";
          ws.getCell(`A${currentRow+1}`).font = { name: 'Arial', size: 9 };

          ws.mergeCells(`A${currentRow+2}:E${currentRow+2}`);
          ws.getCell(`A${currentRow+2}`).value = "e-mail : mktmegumibrayan@gmail.com | Telp : +62 878-9631-2028";
          ws.getCell(`A${currentRow+2}`).font = { name: 'Arial', size: 9 };

          ws.mergeCells(`B${currentRow+3}:D${currentRow+3}`);
          const rTitle = ws.getCell(`B${currentRow+3}`);
          rTitle.value = `SURAT JALAN (${sj.divisi || 'PPIC'})`;
          rTitle.font = { name: 'Arial', size: 12, bold: true, underline: true };
          rTitle.alignment = { horizontal: 'center' };

          ws.mergeCells(`B${currentRow+4}:D${currentRow+4}`);
          const rNoSJ = ws.getCell(`B${currentRow+4}`);
          rNoSJ.value = `No. ${sj.no_surat || '-'}`;
          rNoSJ.font = { name: 'Arial', size: 10, bold: true };
          rNoSJ.alignment = { horizontal: 'center' };

          currentRow += 6;

          ws.getCell(`A${currentRow}`).value = "Kepada Yth.";
          ws.getCell(`B${currentRow}`).value = `: ${custName}`;
          ws.getCell(`B${currentRow}`).font = { bold: true };

          ws.getCell(`D${currentRow}`).value = "Tanggal";
          ws.getCell(`E${currentRow}`).value = `: ${tanggal}`;
          ws.getCell(`E${currentRow}`).font = { bold: true };

          ws.getCell(`A${currentRow+1}`).value = "Dengan hormat,";
          ws.getCell(`A${currentRow+2}`).value = "Bersama surat ini kami mengirimkan barang dengan perincian sebagai berikut :";

          currentRow += 4;

          const headerRow = ws.getRow(currentRow);
          headerRow.values = ["No", "Nama Barang", "Jumlah", "Spesifikasi", "Keterangan"];
          if (sj.divisi === 'MARKETING') {
            headerRow.values = ["No", "Nama Barang", "Jumlah", "Spesifikasi", "Keterangan", "Total Harga"];
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
                  item.keterangan || '-',
                  `Rp ${lineTotal.toLocaleString('id-ID')}`
                ];
              } else {
                itemRow.values = [
                  idx + 1,
                  item.nama_barang || '-',
                  qtyText,
                  item.spesifikasi || '-',
                  item.keterangan || '-'
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
            ws.getRow(currentRow).values = [1, "-", "-", "-", "-"];
            currentRow++;
          }

          if (sj.divisi === 'MARKETING') {
            const totalRow = ws.getRow(currentRow);
            totalRow.values = ["", "Grand Total", "", "", "", `Rp ${grandTotal.toLocaleString('id-ID')}`];
            ws.mergeCells(`B${currentRow}:E${currentRow}`);
            totalRow.getCell(2).font = { bold: true };
            totalRow.getCell(6).font = { bold: true };
            currentRow++;
          }

          currentRow += 1;
          ws.getCell(`A${currentRow}`).value = "Mohon diperiksa kondisi barang dan diterima.";

          currentRow += 2;
          ws.getCell(`A${currentRow}`).value = "Yang Menerima,";
          ws.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

          ws.getCell(`E${currentRow}`).value = `Bekasi, ${tanggal}`;
          ws.getCell(`E${currentRow}`).alignment = { horizontal: 'center' };

          ws.getCell(`E${currentRow+1}`).value = "Hormat kami,";
          ws.getCell(`E${currentRow+1}`).alignment = { horizontal: 'center' };

          currentRow += 4;
          ws.getCell(`A${currentRow}`).value = "( ............................ )";
          ws.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

          ws.getCell(`E${currentRow}`).value = "PT. MEGUMI BRAYAN INDONESIA";
          ws.getCell(`E${currentRow}`).font = { bold: true };
          ws.getCell(`E${currentRow}`).alignment = { horizontal: 'center' };

          currentRow += 4;
        }
      }
    }
  }

  return await workbook.xlsx.writeBuffer();
}

// API 1: GET ALL SURAT JALAN
app.get('/api/surat-jalan', (req, res) => {
  try {
    const { divisi } = req.query;
    let results = [...databaseSuratJalan];

    if (divisi) {
      results = results.filter(item => item.divisi === divisi);
    }

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API 2: POST SURAT JALAN BARU
app.post('/api/surat-jalan', (req, res) => {
  try {
    const dataBaru = req.body;

    if (!dataBaru.no_surat) {
      return res.status(400).json({ success: false, message: 'Nomor surat jalan wajib diisi!' });
    }

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

// API 3: PUT / EDIT SURAT JALAN
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

// API 4: DELETE SURAT JALAN
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

// API 5: EXPORT EXCEL (ON-THE-FLY DOWNLOAD)
app.get('/api/export/excel', async (req, res) => {
  try {
    const { divisi } = req.query;
    const buffer = await generateExcelBuffer(divisi);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Data_Surat_Jalan_${Date.now()}.xlsx`);

    return res.send(buffer);
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