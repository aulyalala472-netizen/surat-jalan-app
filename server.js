const express = require('express');
const app = express();

// WAJIB: Agar server bisa membaca data dari form frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memori sementara untuk menyimpan data surat jalan
let databaseSuratJalan = [];

// Endpoint untuk mengambil semua data surat jalan
app.get('/api/surat-jalan', (req, res) => {
  res.status(200).json(databaseSuratJalan);
});

// Endpoint untuk menyimpan data surat jalan baru
app.post('/api/surat-jalan', (req, res) => {
  try {
    const dataBaru = req.body;
    
    // Validasi data
    if (!dataBaru) {
      return res.status(400).json({ success: false, message: 'Data tidak boleh kosong' });
    }

    // Tambahkan data ke memori
    databaseSuratJalan.push(dataBaru);

    // Kirim respons sukses
    res.status(200).json({
      success: true,
      message: 'Data berhasil disimpan',
      data: dataBaru
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server: ' + error.message
    });
  }
});

// Jalankan server jika di lingkungan lokal
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export app agar dibaca oleh Vercel
module.exports = app;