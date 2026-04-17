const play = require('play-dl');

console.log("=== PENGUJIAN KOMPREHENSIF SKENARIO YOUTUBE ===");

const testCases = [
    {
        name: "1. Link Video Standar",
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    },
    {
        name: "2. Link dengan Playlist (&list=...)",
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw&list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
    },
    {
        name: "3. Link YouTube Shorts",
        url: "https://youtube.com/shorts/3i_O8d2-hxs?feature=share"    // Ganti jika perlu
    },
    {
        name: "4. Link Video Privat / Dihapus / Tidak Valid",
        url: "https://www.youtube.com/watch?v=xxxxxxXXXXX" // ID asal untuk memicu error
    },
    {
        name: "5. Link Live Streaming (Lofi Girl)",
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
    },
    {
        name: "6. Text Random / Bukan URL",
        url: "Halo ini adalah bug bounty 123"
    }
];

async function runDetailedTests() {
    for (let test of testCases) {
        console.log(`\nMenjalankan Test: ${test.name}`);
        console.log(`Input: "${test.url}"`);
        
        try {
            // Validasi tipe URL
            const isValidYoutube = play.yt_validate(test.url);
            
            if (isValidYoutube === false) {
                if (test.name.includes("Bukan URL") || test.name.includes("Text Random")) {
                    console.log(" => (PASS EXPECTED) Sistem berhasil menolak (Invalid URL). Input bukan video youtube!");
                } else {
                    console.log(" => (FAIL) Sistem tidak mengenali URL ini sebagai YouTube.");
                }
                continue;
            } else if (isValidYoutube === 'video') {
                console.log(" => (TERDETEKSI SEBAGAI: VIDEO)");
            } else if (isValidYoutube === 'playlist') {
                console.log(" => (TERDETEKSI SEBAGAI: PLAYLIST)");
            }

            // Mencoba mendapatkan info meta data
            console.log(" => Sedang mengekstrak Metadata...");
            const info = await play.video_info(test.url);
            
            if (info && info.video_details) {
                console.log(` => BERHASIL EKSTRAK: Judul: "${info.video_details.title}"`);
                
                // Cek live stream
                if (info.video_details.live) {
                    console.log(` => PERHATIAN: Video ini sedang berjalan secara LIVE (Tidak disarankan untuk didownload secara utuh).`);
                } else {
                    console.log(` => Status Video Normal. Siap Didownload.`);
                }
            }
        } catch (error) {
            console.log(` => [ERROR / FAILED]: ${error.message}`);
            // Mengidentifikasi apakah ini expected exception (ex: video private/nggak ada)
            if (test.name.includes("Privat") || test.name.includes("Bukan URL")) {
                console.log(`    (Note: Error pada test ini adalah hasil logis yang diharapkan (Expected Behavior) karena memicu proteksi).`);
            }
        }
    }
    console.log("\n=================================");
    console.log("PENGUJIAN SELESAI");
    console.log("=================================");
}

runDetailedTests();
