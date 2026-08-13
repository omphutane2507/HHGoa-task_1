const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const PORT = 8080;

function createServer(port = PORT) {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.static(__dirname));

  app.post("/convert-heic", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const originalName = req.file.originalname;

    try {
      const inputBuffer = req.file.buffer;
      console.log(
        `📥 ${originalName} | ${Math.round(inputBuffer.length / 1024)}KB`,
      );

      const t = Date.now();
      let outputBuffer;
      try {
        outputBuffer = await sharp(inputBuffer, {
          limitInputPixels: false,
          unlimited: true,
        })
          .jpeg({ quality: 60 })
          .toBuffer();
      } catch (sharpErr) {
        console.warn(
          "⚠️ sharp failed, falling back to heic-convert:",
          sharpErr.message,
        );
        const convert = require("heic-convert");
        outputBuffer = Buffer.from(
          await convert({ buffer: inputBuffer, format: "JPEG", quality: 0.6 }),
        );
      }
      console.log(
        `✅ Converted in ${Date.now() - t}ms | ${Math.round(outputBuffer.length / 1024)}KB`,
      );

      const outFileName = originalName.replace(/\.(heic|heif)$/i, ".jpg");
      res.set({
        "Content-Type": "image/jpeg",
        "Content-Length": outputBuffer.length,
        "X-File-Name": encodeURIComponent(outFileName),
      });
      res.send(outputBuffer);
    } catch (err) {
      console.error("❌", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  createServer(PORT);
}

module.exports = { app: createServer, createServer };
