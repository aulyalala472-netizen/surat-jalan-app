const express = require('express');
const app = express();

// Middleware parsing data JSON dari frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memori penampung data sementara
let dataSuratJalan = [];

// Endpoint GET untuk mengambil data
app.get('/api/surat-jalan', (req, res) => {
  res.status(200).json(dataSuratJalan);
});

// Endpoint POST untuk menyimpan data
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
      message: 'Terjadi kesalahan server: ' + error.message
    });
  }
});

// Export handler serverless Vercel
module.exports = app;
