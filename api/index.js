const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis (index.html, app.js, logo.png) secara langsung
app.use(express.static(path.join(__dirname, '../')));

let dataSuratJalan = [];

app.get('/api/surat-jalan', (req, res) => {
  res.status(200).json(dataSuratJalan);
});

app.post('/api/surat-jalan', (req, res) => {
  try {
    const inputData = req.body;
    dataSuratJalan.push(inputData);

    return res.status(200).json({
      success: true,
      message: 'Data berhasil disimpan!',
      data: inputData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan: ' + error.message
    });
  }
});

// Menangani semua route selain API untuk menampilkan index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = app;
  
