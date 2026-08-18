let activeRowForCamera = null;
let mediaStream = null;

// Jalankan pembuatan baris pertama saat aplikasi dibuka
document.addEventListener('DOMContentLoaded', () => {
    addNewRow();
});

// --- FUNGSI MANAJEMEN BARIS TABEL ---
function addNewRow() {
    const tableBody = document.getElementById('tableBody');
    const rowId = 'row-' + Date.now();
    
    const tr = document.createElement('tr');
    tr.id = rowId;
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
        <td class="p-3">
            <input type="text" name="nama_barang[]" placeholder="Contoh: Laptop Asus" required 
                class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 text-xs">
        </td>
        <td class="p-3">
            <input type="number" name="jumlah[]" placeholder="0" min="1" required 
                class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 text-xs">
        </td>
        <td class="p-3">
            <input type="hidden" name="foto_data[]" class="foto-data">
            <div class="flex items-center gap-2">
                <button type="button" onclick="openCameraModal(this)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition border border-slate-200 flex items-center gap-1">
                    <i class="fa-solid fa-camera text-red-600"></i> Pilih / Foto
                </button>
                <div class="foto-preview-container hidden relative group">
                    <img src="" class="foto-preview w-8 h-8 object-cover rounded-lg border border-slate-300">
                    <button type="button" onclick="removePhoto(this)" class="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center opacity-80 hover:opacity-100">
                        &times;
                    </button>
                </div>
            </div>
        </td>
        <td class="p-3 text-center">
            <button type="button" onclick="deleteRow('${rowId}')" class="text-slate-400 hover:text-red-600 transition p-1">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>
    `;
    tableBody.appendChild(tr);
}

function deleteRow(rowId) {
    const tableBody = document.getElementById('tableBody');
    if (tableBody.children.length > 1) {
        document.getElementById(rowId).remove();
    } else {
        alert('Minimal harus ada 1 baris input data!');
    }
}

function removePhoto(button) {
    const row = button.closest('tr');
    row.querySelector('.foto-data').value = '';
    row.querySelector('.foto-preview').src = '';
    row.querySelector('.foto-preview-container').classList.add('hidden');
}

// --- HELPER KAMERA & FOTO GALERI ---

function openCameraModal(btn) {
    activeRowForCamera = btn.closest('tr');
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('webcamVideo');

    modal.classList.remove('hidden');

    // Aktifkan Webcam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            mediaStream = stream;
            video.srcObject = stream;
        })
        .catch(err => {
            console.warn("Kamera tidak ditemukan / tidak diizinkan, opsi galeri tetap dapat digunakan:", err);
        });
}

function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('webcamVideo');

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    video.srcObject = null;
    modal.classList.add('hidden');
    activeRowForCamera = null;
}

// Tangkap foto dari Video Kamera
function capturePhoto() {
    if (!activeRowForCamera) return;

    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');

    if (!video.srcObject) {
        alert('Kamera tidak aktif/tersedia. Silakan gunakan opsi Galeri!');
        return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Kompres ke Base64 (JPEG quality 0.7)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    savePhotoToActiveRow(dataUrl);
}

// Handler untuk membaca file yang dipilih dari Galeri Perangkat
function handleGalleryUpload(inputElem) {
    const file = inputElem.files[0];
    if (!file || !activeRowForCamera) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Resize / Kompres gambar galeri agar tidak memberatkan memori
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxWidth = 800;
            const scaleSize = maxWidth / img.width;
            
            if (scaleSize < 1) {
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

            savePhotoToActiveRow(compressedDataUrl);
            inputElem.value = ''; // Reset input galeri
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Helper untuk menempelkan hasil foto ke input hidden dan preview
function savePhotoToActiveRow(dataUrl) {
    const imgDataInput = activeRowForCamera.querySelector('.foto-data');
    const previewContainer = activeRowForCamera.querySelector('.foto-preview-container');
    const previewImg = activeRowForCamera.querySelector('.foto-preview');

    imgDataInput.value = dataUrl;
    previewImg.src = dataUrl;
    previewContainer.classList.remove('hidden');

    closeCameraModal();
}

// Handler Form Submit
document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const result = [];
    
    const namaBarang = formData.getAll('nama_barang[]');
    const jumlah = formData.getAll('jumlah[]');
    const fotoData = formData.getAll('foto_data[]');

    for (let i = 0; i < namaBarang.length; i++) {
        result.push({
            nama_barang: namaBarang[i],
            jumlah: jumlah[i],
            foto: fotoData[i] || null
        });
    }

    console.log("Data Siap Dikirim ke Server:", result);
    alert(`Berhasil menyimpan ${result.length} data barang! Cek console browser.`);
});