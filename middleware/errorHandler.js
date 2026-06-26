const multer = require("multer");

const globalErrorHandler = (err, req, res, next) => {
  console.error("[GLOBAL ERROR HANDLER]:", err.message);

  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.error("File terlalu besar, maks 10MB.", 400);
    }
    return res.error(err.message, 400);
  }

  
  if (err.message === "Tipe file tidak valid. Hanya JPEG, PNG, atau GIF.") {
    return res.error(err.message, 400);
  }

  
  return res.error(err.message || "Terjadi kesalahan pada server.", 500);
};

module.exports = globalErrorHandler;
