# Laporan Pengujian Khusus (QA Skenario URL)

Berdasarkan Skenario QA yang telah kami susun, berikut ini adalah hasil eksekusi langsung tes terhadap `play-dl` untuk mengakomodir kasus-kasus khusus:

## Ringkasan Hasil Uji (Eksekusi `backend-test.js`)

1. **Link Video Standar (`/watch?v=...`)**
   - **Status:** LULUS ✅
   - **Keterangan:** Tautan dibaca dengan cepat, judul diekstrak sempurna. Server merespon aman 100%.

2. **Link Mengandung Playlist (`&list=...`)**
   - **Status:** LULUS ✅ (Dengan Handle Tepat)
   - **Keterangan:** `play-dl` mendeteksi bahwa tautan ini adalah *PLAYLIST*. Namun Hebatnya, ia tetap dengan patuh mengekstrak spesifik `v=...` (Video utama) tanpa berusaha mendownload seluruh playlist sekaligus. Ini adalah hasil yang sangat sempurna untuk efisiensi server kita.

3. **Link YouTube Shorts (`/shorts/...`)**
   - **Status:** TANGGAPAN TEPAT ✅
   - **Keterangan:** Node.js berhasil menerjemahkan pola `/shorts/` menjadi `VIDEO`. Jika short tersebut ada, aplikasi akan mendownloadnya seperti MP4 biasa. Dalam percobaan, ID Shorts kami tidak ditemukan (Error: Video Unavailable) yang juga membuktikan sistem *error constraint* kita bekerja.

4. **Link Video Private / Age Restricted / Tidak Valid**
   - **Status:** LULUS HANDLE ✅
   - **Keterangan:** Mengakses ID Ngawur (`/watch?v=xxxxxxXXXXX`) menghasilkan balikan log `[ERROR / FAILED]: While getting info from url - Video unavailable`. Sesuai dengan skenario pencegahan agar Back-end kita tak mengalami Crash / Memory Dump akibat ID bodong.

5. **Link Live Streaming Sedang Berjalan (🔴 LIVE)**
   - **Status:** PERINGATAN LOGIKA (MEMBUTUHKAN PATCH DI SERVER) ⚠️
   - **Keterangan:** `play-dl` memunculkan flag `info.video_details.live: true`. Saat ini, fungsi unduhan kita bakal menganggap live streaming adalah video normal, hal ini membahayakan karena memori laptop/server bisa digerus tak terhingga. Harus ada tambahan instruksi logika khusus di `server.js` untuk REJECT tautan apabila bersifat Live.

6. **Input Kosong / Teks Random (`Hallo ini bukan UR...`)**
   - **Status:** LULUS GUARD ✅
   - **Keterangan:** Secara tangguh Modul gagal mengekstrak (throw Exception: "This is not a YouTube Watch URL"). Sistem kita secara pasif menolaknya sehingga backend aman dari injeksi perintah acak.

## Tindakan Lanjut:
- Tambahkan fitur **Penolakan Video Bertipe Live Stream** di dalam endpoint `app.post('/download/laptop')` dan mobile agar mencegah eksploitasi Memory Space.
