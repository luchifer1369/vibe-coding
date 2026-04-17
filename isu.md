# Rencana Pembuatan Aplikasi YouTube Downloader (Web & Mobile Friendly)

Aplikasi web ini memungkinkan pengguna mendownload video YouTube dengan 2 mode eksekusi menggunakan satu antarmuka:
- **Mode Mobile (Toggle ON)**: Mengabaikan "Path", video akan di-stream (dikirim) langsung ke browser perangkat pengakses sehingga bisa disimpan di memori HP. Form input path menjadi read-only.
- **Mode PC / Laptop (Toggle OFF)**: Video didownload dan diletakkan ke dalam direktori file sistem server/laptop target berdasarkan "Path" spesifik dari user.

## Fase 1: Inisialisasi Proyek dan Setup Dependencies
1. **Inisialisasi npm**: Jalankan `npm init -y` untuk membuat konfigurasi awal Node.js.
2. **Install Dependensi Utama**: 
   - `express`: Framework backend untuk membuat server.
   - `@distube/ytdl-core`: Library pengunduh YouTube stabil.
   - `cors`: Mengizinkan akses antar lintas perangkat/domain jika diperlukan.
   - *Opsional*: `socket.io` (untuk mengirim status progress bar download dari backend ke frontend secara *real-time*).

## Fase 2: Membangun Struktur Frontend (UI/UX)
Semua file web (HTML, CSS, JS) akan diletakkan di dalam folder `public`.
1. **Elemen Antarmuka (`index.html`)**:
   - Tombol "Toggle Switch" ON/OFF di ujung kiri atas untuk mengganti mode (Mobile vs Laptop).
   - Form input **URL YouTube**.
   - Form input **Path Direktori** (Misal: `C:\Users\Downloads\video.mp4`).
   - Tombol **Download** yang responsif.
   - **Progress Bar** dengan format persentase % download.
2. **Styling Premium (`style.css`)**:
   - Gunakan skema warna *Dark Mode* dengan gradasi neon.
   - Tambahkan animasi dan transisi agar UI terasa kekinian dan mahal (*glassmorphism*).
3. **Interaksi Logic (`script.js`)**:
   - Deteksi *event* klik pada Toggle Switch ON/OFF.
   - Jika Toggle di-set ke **ON (Mobile)**: Input Path menjadi `disabled`/`read-only` dan bernilai default "Download ke Perangkat Ini".
   - Jika Toggle di-set ke **OFF (Laptop)**: Input Path dapat disesuaikan manual.
   - Kirim `request` (AJAX/Fetch) ke Backend menggunakan parameter url, mode, dan lokasi path. Menangani pembaruan progress bar.

## Fase 3: Logika Backend dan Routing (`server.js`)
1. **Server Express**:
   - Buat server Express jalan di host `0.0.0.0` dan port `3000` (agar dapat dibuka dari HP maupun Laptop satu jaringan WiFi).
   - Serve static folder `/public`.
2. **Endpoint `/download`**:
   - **Mode Mobile (ON)**: Backend mendownload stream dari `ytdl-core` langsung dipipe `.pipe(res)` disertai pengaturan *header* `Content-Disposition: attachment`. Ini memaksa browser langsung menyimpan file lokal (di memori HP/Perangkat pengakses).
   - **Mode Laptop/Server (OFF)**: Backend mendownload konten stream dari `ytdl-core` dan menyimpannya menggunakan sistem `fs.createWriteStream(path)` ke lokasi di harddisk laptop (sesuai value input "Path").
3. **Sistem Progress Bar (Socket.io)**:
   - Sediakan event `.on('progress')` yang dimiliki oleh `ytdl`, lalu emisikan bit-bit ukuran file tersebut ke frontend untuk merender presentase Progress Bar (baik % dan kecepatan/ukuran).

## Fase 4: Pengujian Lokal & Akses Perangkat
1. Eksekusi server menggunakan `node server.js` di Laptop (sebagai host).
2. Tes Laptop: Buka browser `http://localhost:3000`, tes dengan toggle **OFF** dan berikan _Path C:/_ lokal Laptop. Pastikan file muncul di File Explorer Laptop.
3. Tes Smartphone: Cari IP address lokal laptop (misal: `192.168.100.12`), buka alamat tersebut di Chrome browser HP `http://192.168.100.12:3000`. 
4. Tes toggle **ON** di HP, tes download dan perhatikan layar jika file `.mp4` berhasil didownload di Storage Manager HP.
