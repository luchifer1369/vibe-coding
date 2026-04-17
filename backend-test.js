const play = require('play-dl');
const http = require('http');

console.log("--- PENGUJIAN FASE 4: TESTING SYSTEM (BUG FIX) ---");

async function testPlayDl() {
    console.log("[Test 1]: API play-dl Fetch Meta Data");
    try {
        const url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // Me at the zoo
        
        // play-dl validation
        const info = await play.video_info(url);
        
        if (info && info.video_details.title) {
            console.log(`   > URL Valid. Mengambil info video...`);
            console.log(`   [PASS] Judul: "${info.video_details.title}"`);
            return true;
        } else {
             return false;
        }
    } catch (error) {
        console.error(`   [FAIL] play-dl error: ${error.message}`);
        return false;
    }
}

async function run() {
    const r1 = await testPlayDl();
    
    console.log("\n==========================================");
    if(r1) {
        console.log("STATUS: BUG BERHASIL DIPERBAIKI (PASSED)");
    } else {
        console.log("STATUS: MASIH TERDAPAT ERROR (FAILED)");
    }
    console.log("==========================================");
}

run();
