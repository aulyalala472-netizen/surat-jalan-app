const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database (Contoh Simpanan Data Temporary)
let databaseSuratJalan = [];

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

// REVISI: API BARU 3 - PUT / EDIT SURAT JALAN BERDASARKAN NO SURAT
app.put('/api/surat-jalan/:no_surat', (req, res) => {
  try {
    const { no_surat } = req.params;
    const decodedNoSurat = decodeURIComponent(no_surat);
    const dataUpdate = req.body;

    const index = databaseSuratJalan.findIndex(item => item.no_surat === decodedNoSurat);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Data surat jalan tidak ditemukan!' });
    }

    // Jika nomor surat diubah saat edit, pastikan tidak duplikat dengan record lain
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

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});