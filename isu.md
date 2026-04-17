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
**Tujuan Dasar**: Membuat struktur User Interface (UI) web statis yang menarik untuk dilihat, responsif, dan fungsional di bagian antarmuka sebelum disambung ke server Backend sesungguhnya. **Lokasi pengerjaan:** di dalam folder root, buat direktori bernama `public` untuk tempat bekerja.

**1. Persiapkan File dan Folder**
- Buat folder baru dengan nama `public` di root direktori project.
- Di dalam folder `public`, buat tiga (3) file kosong: `index.html`, `style.css`, dan `script.js`.

**2. Struktur HTML5 (`public/index.html`)**
- Buat template kerangka dasar HTML5. Hubungkan tag `<head>` dengan file `style.css` menggunakan tag `<link>` dan di atas tag penutup `</body>` panggil logika antarmuka dari `script.js` menggunakan tag `<script>`.
- Buat area *Navbar / Header* di bagian paling atas: masukkan *Toggle Switch* checkbox beserta Label (contoh Label: "Unduh ke HP"). Pastikan ditempatkan posisinya di **KIRI ATAS**.
- Buat sebuah `<main>` kontainer atau `<form>` (tempatkan secara vertikal & horizontal agar berada di tengah layar):
  - Buat **Input URL (tipe Text)**. Beri ID (contoh: `id="urlInput"`) untuk menampung link URL Youtube.
  - Buat **Input Path (tipe Text)**. Beri ID (contoh: `id="pathInput"`) untuk menampung format direktori misal (`C:\Downloads`).
  - Buat **Tombol Download**. Beri ID (contoh: `id="downloadBtn"`).
- Bagian Indikator Progress: Di bawah tombol download, buat container `div` untuk Progress Bar. Isinya tag kosong dengan ID `id="progressBar"` (yang mana lebarnya akan bertambah), dan label teks untuk persentase `id="progressText"` (Mulai dari format `0%`).

**3. Desain CSS Premium (`public/style.css`)**
- Berikan gaya **Dark Mode** secara utuh. Buat background `body` berwarna abu-abu sangat gelap (hitam doff / `#121212`). Gunakan gaya font *sans-serif* yang rapi (seperti dari Google Fonts: *Inter*).
- Gunakan metode pewarnaan Neon pada *Tombol Download* saat *hover*. Beri bayangan *(drop-shadow/glow)* warna biru terang atau ungu agar tampil *stand-out*.
- Gunakan efek lekuk-lekuk / desain kotak modern pada form input dengan menggunakan `border-radius: 8px` / `12px`.
- Koding khusus bagian **Toggle Switch di pojok kiri**. Ubah elemen `<input type="checkbox">` dasar bawaan HTML supaya di-stylize menjadi desain *Toggle Switch Slider* horizontal yang berbentuk panjang-membulat (pil) dan dapat bergeser *smooth* ketika diklik.
- Desain *Progress Bar* sebagai persegi panjang dengan background pudar dan warna progress hijau terang. Atur lebarnya menjadi 0% lewat CSS awal menggunakan efek `transition: width 0.3s ease;` supaya animasinya terlihat lembut dan tidak kaku ketika ukurannya bertambah.

**4. Interaksi JavaScript Murni (`public/script.js`)**
(Fokus di Fase 2 ini hanya pada logika perilaku elemen UI form, *mockup* data, dan pembacaan *event*. Jangan mendesain kode request ke server backend asli (Abaikan Fetch) dulu).
- Deklarasikan konstanta variabel untuk menyeleksi dan memanggil semua elemen (*DOM Selectors*) menggunakan fungsi `document.getElementById()`. Ambil Toggle, Input URL, Input Path, dan Tombol Download.
- **Logika Toggle (Mode Perangkat)**: Buat `eventListener` ('change') yang senantiasa memonitor reaksi elemen Toggle Switch.
  - *Jika checkbox dicentang* (`checked === true` artinya Mode HP aktif): Set property input form menjadi `pathInput.disabled = true;`. Ubah juga isi placeholder atau `value`-nya ke "Disediakan di Memori HP" sehingga pengguna tahu bahwa di HP, form untuk path file tidak perlu diisi dan akan terkunci (*Read-Only*).
  - *Jika checkbox tak dicentang* (`checked === false` artinya Mode Laptop aktif): Kembalikan kondisi logikanya senormalnya: `pathInput.disabled = false;` lalu bersihkan/osongkan field isinya supaya user bisa mengetik path sendiri lagi.
- **Logika Tombol Download**: Pada *event onClick* ('click'), cukup tangkap `value` URL dalam *string* dan tangkap status value dari Mode Toggle (dicentang atau tidak). Cetak hal ini dan tampilkan statusnya menggunakan `console.log()` untuk memverifikasi fungsional jika nilainya terbaca dengan lancar. (Proses mengirim nilainya ke backend secara aslinya, baru akan kita kerjakan di bagian Fase 3 mendatang).

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
