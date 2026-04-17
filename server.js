const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const play = require('play-dl');
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
        const info = await play.video_info(url);
        const title = info.video_details.title.replace(/[^\w\s]/gi, '');
        const fullPath = path.join(targetPath, `${title}.mp4`);

        const streamData = await play.stream(url);
        const stream = streamData.stream;
        const total = streamData.content_length;
        let downloaded = 0;

        stream.on('data', (chunk) => {
            downloaded += chunk.length;
            const percent = (downloaded / total) * 100;
            io.emit('progress-laptop', { percent: percent.toFixed(2) });
        });

        const writestream = fs.createWriteStream(fullPath);
        stream.pipe(writestream);

        writestream.on('finish', () => {
            console.log(`Finished downloading: ${fullPath}`);
            res.json({ success: true, message: `File saved to ${fullPath}` });
        });

        writestream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to download to target path" });
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
        const info = await play.video_info(url);
        const title = info.video_details.title.replace(/[^\w\s]/gi, '');
        
        const streamData = await play.stream(url);
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        streamData.stream.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to stream video");
    }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
