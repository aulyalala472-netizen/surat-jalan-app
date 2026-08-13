const express = require('express');
const app = express();

// WAJIB: Agar server bisa membaca JSON dari frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memori sementara untuk menyimpan data surat jalan
let databaseSuratJalan = [];

// Endpoint GET: Mengambil data surat jalan sesuai divisi
app.get('/api/surat-jalan', (req, res) => {
  const { divisi } = req.query;
  if (divisi) {
    const filteredData = databaseSuratJalan.filter(item => item.divisi === divisi);
    return res.status(200).json(filteredData);
  }
  res.status(200).json(databaseSuratJalan);
});

// Endpoint POST: Menyimpan data surat jalan baru
app.post('/api/surat-jalan', (req, res) => {
  try {
    const dataBaru = req.body;
    
    if (!dataBaru || !dataBaru.no_surat) {
      return res.status(400).json({ success: false, message: 'Data tidak valid atau kosong' });
    }

    // Masukkan data ke array
    databaseSuratJalan.push(dataBaru);

    return res.status(200).json({
      success: true,
      message: "Data berhasil disimpan",
      data: dataBaru
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Jalankan server jika lokal
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;