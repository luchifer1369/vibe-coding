const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MODE LAPTOP: Download and save to a local path
app.post('/download/laptop', async (req, res) => {
    const { url, path: targetPath } = req.body;

    if (!url || !targetPath) {
        return res.status(400).json({ error: "URL and Path are required" });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        const fullPath = path.join(targetPath, `${title}.mp4`);

        // Ensure directory exists (simplified for this demo)
        const stream = ytdl(url, { quality: 'highestvideo', filter: 'audioandvideo' });
        
        stream.on('progress', (chunkLength, downloaded, total) => {
            const percent = (downloaded / total) * 100;
            io.emit('progress-laptop', { percent: percent.toFixed(2) });
        });

        stream.pipe(fs.createWriteStream(fullPath));

        stream.on('end', () => {
            console.log(`Finished downloading: ${fullPath}`);
            res.json({ success: true, message: `File saved to ${fullPath}` });
        });

        stream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to download" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Invalid YouTube URL or unreachable path" });
    }
});

// MODE MOBILE: Stream directly to the browser
app.get('/download/mobile', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send("URL is required");
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        
        ytdl(url, { quality: 'highestvideo', filter: 'audioandvideo' }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to stream video");
    }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Access from mobile using your IP address (e.g., http://192.168.x.x:${PORT})`);
});
