const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const processImageToWebP = async (buffer) => {
  try {
    const timestamp = Date.now();
    const filename = `${timestamp}.webp`;
    const ogFilename = `${timestamp}-og.jpg`;
    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, filename);
    const ogFilePath = path.join(uploadDir, ogFilename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 1. Simpan versi WebP untuk performa website optimal
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(filePath);

    // 2. Simpan versi JPEG 1200x630 untuk thumbnail sosial media (WhatsApp, LinkedIn, Facebook)
    try {
      await sharp(buffer)
        .resize(1200, 630, { fit: "cover", position: "center" })
        .jpeg({ quality: 85 })
        .toFile(ogFilePath);
    } catch (ogErr) {
      console.warn("Gagal membuat versi -og.jpg:", ogErr.message);
    }

    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saat memproses gambar:", error);
    throw new Error("Gagal memproses gambar.");
  }
};

// Pastikan diekspor sebagai objek
module.exports = { processImageToWebP };