# Fase 3: Logika Backend, Routing, dan Integrasi YTDL-Core

**Tujuan Dasar:**
Membangun server *backend* menggunakan Node.js (Express) untuk menangani permintaan pengunduhan YouTube menggunakan *library* `@distube/ytdl-core`. Server ini akan mengirim balik data "kemajuan persentase (progress bar)" secara *real-time* kepada frontend lewat koneksi Socket.io. Server juga menangani pemisahan *"Logika Mobile (Penyimpanan ke HP yang sedang membuka website)"* dan *"Logika Komputer (Penyimpanan langsung di folder laptop)"*.

**Lokasi Pekerjaan:**
1. Tambahkan `server.js` di direktori *root* (di luar folder `public`).
2. Modifikasi `public/index.html` (untuk penambahan skrip client socket.io).
3. Modifikasi `public/script.js` (untuk penghubungan pengiriman data ke server asli).

---

### Langkah-Langkah Singkat & Jelas (Akan Dikerjakan oleh Programmer / AI Model)

**Langkah 1: Menyusun `server.js` (Sebagai Mesin Dasar Server)**
- Buat file `server.js` di root folder.
- **Import Library**: Panggil bawaan Node `express`, `http`, `socket.io`, `cors`, `fs` (File System), dan `ytdl` (dari module `@distube/ytdl-core`).
- **Inisialisasi Server**: 
  - Bangun aplikasi Express: `const app = express();`.
  - Pasang perantara `app.use(cors())`, `app.use(express.json())`, dan sediakan folder statis `app.use(express.static('public'))`.
  - Gunakan `http.createServer(app)` lalu pasang protokol *websocket* dengan kode `const io = require('socket.io')(server);`.
  - Nyalakan *listener* di port `3000` dengan host `0.0.0.0` supaya aplikasi dapat diakses menyebrangi HP di jaringan WiFi yang sama (`server.listen(3000, '0.0.0.0', ...)`).

**Langkah 2: Membangun Logika Pipa Pengunduh (Routing `server.js`)**
Buat dua *endpoints* (rute url) khusus untuk melayani 2 mode berbeda:
1.  **`/download/laptop` (Endpoint `POST`)** — *Digunakan ketika Mode Laptop aktif.*
    - Terima `req.body.url` dan `req.body.path`.
    - Panggil fungsi `ytdl(url)`. Selipkan tangkapan peristiwa `.on('progress', ...)` untuk menghitung pembagian letak file (terunduh dibagi durasi/ukuran), ubah mejadi persentase (0% s/d 100%), lalu sebutkan ke *socket*: `io.emit('progress-laptop', { percent })`.
    - Lakukan penulisan ke memori laptop dengan menggabungkan stream itu ke lokasi: `.pipe(fs.createWriteStream(path_lengkap_dan_judul))`.
2.  **`/download/mobile` (Endpoint `GET`)** — *Digunakan ketika Mode HP aktif.*
    - Terima penamaan tautan web dari `req.query.url`.
    - Pastikan *response header Content-Disposition* disetel bertulis `attachment; filename="video.mp4"` agar browser HP kita ditipu untuk murni men-downloadnya.
    - Pipa langsung isian stream `ytdl(url)` ke *response* pengguna: `ytdl(url).pipe(res)`. (Otomatis bar hijau terdownload menempel masuk memori HP).

**Langkah 3: Pembaruan `index.html` dan `script.js` (Menyambungkan ke Mesin Server)**
Koneksikan tampilan (UI) agar mau mengobrol dengan Backend Node.js yang sudah kita buat.
1. Masuk ke `public/index.html` dan tempel `<script src="/socket.io/socket.io.js"></script>` sesaat sebelum pemanggilan `<script src="script.js"></script>`. Ini menyediakan penghubung perpesanan.
2. Masuk ke `public/script.js`:
   - Deklarasikan penyambung *socket* di baris awal: `const socket = io();`.
   - Modifikasi tombol **Logika Tombol Download**: Buang kode simulasi (mockup). Ganti isinya dengan kondisi:
      - **Jika Mode Mobile aktif**: Gunakan skrip sederhana `window.location.href = '/download/mobile?url=' + encodeURIComponent(urlInput.value)`. Ini akan memaksa Chrome/Safari di HP memicu pengunduhan file .mp4.
      - **Jika Mode Laptop aktif**: Gunakan AJAX Javascript terbaru memanggil **Fetch API**: `fetch('/download/laptop', { method: 'POST', body: JSON.stringify({ url: url, path: path }), headers: {'Content-Type': 'application/json'} })`.
   - **Tangkap Puing Progress Bar**: Beritahu *socket* agar mendengarkan channel bernama `'progress-laptop'`: `socket.on('progress-laptop', (data) => { document.getElementById('progressBar').style.width = data.percent + '%'; });` dengan sedemikian, lebar progress bar naik berdasarkan hitungan persis file tersebut di laptop.
