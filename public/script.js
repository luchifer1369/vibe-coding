// Select elements
const modeToggle = document.getElementById('modeToggle');
const urlInput = document.getElementById('urlInput');
const pathInput = document.getElementById('pathInput');
const downloadBtn = document.getElementById('downloadBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Initialize Socket.io
const socket = io();

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

// Download button logic
downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value;
    const path = pathInput.value;
    const isMobileMode = modeToggle.checked;

    if (!url) {
        alert("Silakan masukkan URL YouTube terlebih dahulu!");
        return;
    }

    if (!isMobileMode && !path) {
        alert("Silakan masukkan Path penyimpanan untuk Laptop!");
        return;
    }

    downloadBtn.disabled = true;
    downloadBtn.innerText = "Processing...";
    updateProgress(0);

    if (isMobileMode) {
        // --- MOBILE MODE (Stream) ---
        // Redirecting to the GET endpoint will trigger a browser download
        window.location.href = `/download/mobile?url=${encodeURIComponent(url)}`;
        
        // Reset button after a delay (since we can't track stream progress easily via redirect)
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerText = "Download Now";
        }, 5000);

    } else {
        // --- LAPTOP MODE (Server-side Save) ---
        try {
            const response = await fetch('/download/laptop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, path })
            });

            const result = await response.json();

            if (result.success) {
                alert("Download Berhasil: " + result.message);
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan teknis.");
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerText = "Download Now";
        }
    }
});

// Listen for progress from server (Laptop Mode)
socket.on('progress-laptop', (data) => {
    updateProgress(data.percent);
});

function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    progressText.innerText = percent + '%';
}
