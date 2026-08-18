// Variable Global untuk menyimpan baris tabel aktif yang membuka modal
let activeRowForCamera = null;
let mediaStream = null;

// --- DOKUMEN SIAP ---
document.addEventListener("DOMContentLoaded", () => {
    // Inisialisasi event listeners jika diperlukan
});

// --- MANAJEMEN TABEL BARANG ---

// Tambah baris baru ke tabel
function addNewRow() {
    const tableBody = document.getElementById('tableBody');
    const newRow = document.createElement('tr');
    newRow.className = 'border-b item-row';
    newRow.innerHTML = `
        <td class="p-3 align-top">
            <input type="text" name="nama_barang[]" placeholder="Masukkan nama barang..." class="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500">
        </td>
        <td class="p-3 align-top">
            <input type="hidden" name="foto_barang[]" class="foto-data">
            <div class="foto-preview-container hidden mb-2 relative group w-24 h-24 rounded-lg overflow-hidden border">
                <img src="" alt="Preview" class="foto-preview w-full h-full object-cover">
                <button type="button" onclick="removePhoto(this)" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-80 hover:opacity-100">&times;</button>
            </div>
            <button type="button" onclick="openCameraModal(this)" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-camera"></i> Upload / Ambil Foto
            </button>
        </td>
        <td class="p-3 align-top text-center">
            <button type="button" onclick="removeRow(this)" class="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-semibold">
                <i class="fa-solid fa-trash"></i> Hapus
            </button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Hapus baris dari tabel
function removeRow(buttonElem) {
    const row = buttonElem.closest('tr');
    const totalRows = document.querySelectorAll('#tableBody .item-row').length;

    if (totalRows > 1) {
        row.remove();
    } else {
        alert('Minimal harus ada 1 baris data!');
    }
}

// Hapus foto yang sudah diunggah di baris tertentu
function removePhoto(buttonElem) {
    const row = buttonElem.closest('tr');
    const imgDataInput = row.querySelector('.foto-data');
    const previewContainer = row.querySelector('.foto-preview-container');
    const previewImg = row.querySelector('.foto-preview');

    if (imgDataInput) imgDataInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewContainer) previewContainer.classList.add('hidden');
}


// --- FUNGSI MODAL KAMERA & GALERI ---

// Buka Modal Kamera
async function openCameraModal(buttonElem) {
    activeRowForCamera = buttonElem.closest('tr');
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('webcamVideo');

    modal.classList.remove('hidden');

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }, // Utamakan kamera belakang pada seluler
            audio: false
        });
        video.srcObject = mediaStream;
    } catch (err) {
        console.warn("Kamera tidak dapat diakses atau diizinkan:", err);
        // Tetap tampilkan modal agar pengguna masih bisa memilih dari galeri
    }
}

// Tutup Modal Kamera
function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    modal.classList.add('hidden');

    // Matikan stream kamera jika aktif
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    activeRowForCamera = null;
}

// Tangkap Foto dari Webcam
function capturePhoto() {
    if (!activeRowForCamera) return;

    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    applyPhotoToRow(activeRowForCamera, dataUrl);

    closeCameraModal();
}

// Menangani Unggahan Foto dari Galeri Perangkat
function handleGalleryUpload(inputElem) {
    const file = inputElem.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Harap pilih berkas gambar yang valid!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        
        // Kompresi gambar dari galeri agar ukuran string Base64 aman
        compressImage(dataUrl, 800, 0.7, (compressedDataUrl) => {
            if (activeRowForCamera) {
                applyPhotoToRow(activeRowForCamera, compressedDataUrl);
                closeCameraModal();
            }
        });
    };
    reader.readAsDataURL(file);

    // Reset nilai input file
    inputElem.value = '';
}


// --- HELPER UMUM ---

// Pasang string data foto ke baris tabel
function applyPhotoToRow(row, dataUrl) {
    const imgDataInput = row.querySelector('.foto-data');
    const previewContainer = row.querySelector('.foto-preview-container');
    const previewImg = row.querySelector('.foto-preview');

    if (imgDataInput) imgDataInput.value = dataUrl;
    if (previewImg) previewImg.src = dataUrl;
    if (previewContainer) previewContainer.classList.remove('hidden');
}

// Kompresi Gambar berbasis HTML5 Canvas
function compressImage(src, maxWidth, quality, callback) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', quality));
    };
}