const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const processImageToWebP = async (buffer) => {
  try {
    const timestamp = Date.now();
    const filename = `${timestamp}.webp`;
    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(filePath);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saat memproses gambar:", error);
    throw new Error("Gagal memproses gambar.");
  }
};

// Pastikan diekspor sebagai objek
module.exports = { processImageToWebP };