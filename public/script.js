// Select elements
const modeToggle = document.getElementById('modeToggle');
const urlInput = document.getElementById('urlInput');
const pathInput = document.getElementById('pathInput');
const downloadBtn = document.getElementById('downloadBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Toggle logic (Mobile vs Laptop)
modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        // Mode Mobile (HP) Active
        pathInput.disabled = true;
        pathInput.value = "Disediakan di Memori HP";
    } else {
        // Mode Laptop Active
        pathInput.disabled = false;
        pathInput.value = "";
        pathInput.placeholder = "C:\\Downloads";
    }
});

// Download button logic (Fase 2: Mockup only)
downloadBtn.addEventListener('click', () => {
    const url = urlInput.value;
    const path = pathInput.value;
    const isMobileMode = modeToggle.checked;

    if (!url) {
        alert("Silakan masukkan URL YouTube terlebih dahulu!");
        return;
    }

    console.log("--- DOWNLOAD REQUEST (Mockup) ---");
    console.log("URL:", url);
    console.log("Mode:", isMobileMode ? "HP (Mobile)" : "Laptop (Desktop)");
    console.log("Path:", isMobileMode ? "Internal Storage" : path);
    console.log("---------------------------------");

    // Simulating progress bar for UI demo
    simulateDownload();
});

// Utility to simulate progress
function simulateDownload() {
    let progress = 0;
    downloadBtn.disabled = true;
    downloadBtn.innerText = "Processing...";

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            downloadBtn.disabled = false;
            downloadBtn.innerText = "Download Now";
            setTimeout(() => {
                alert("Simulasi Selesai! (Fase 3 akan menyambungkan ke Server)");
                progress = 0;
                updateProgress(0);
            }, 500);
        }
        updateProgress(progress);
    }, 400);
}

function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    progressText.innerText = percent + '%';
}
