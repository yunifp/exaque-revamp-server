require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const responseHandler = require("./middleware/responseHandler");
const globalErrorHandler = require("./middleware/errorHandler");

// Import repository artikel untuk mengambil data gambar saat bot datang
const articleRepo = require("./repositories/articleRepository");

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://logikarya.my.id",
  "https://exaque.com",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(responseHandler);

// =========================================================================
// ROUTE KHUSUS YANG TIDAK BOLEH DITANGKAP PRERENDER (HARUS DI ATAS)
// =========================================================================
const sitemapController = require("./controllers/sitemapController");
app.get("/sitemap.xml", sitemapController.generateSitemap);
app.get("/sitemap.rss", sitemapController.generateRssSitemap);

// =========================================================================
// PRERENDER.IO MIDDLEWARE UNTUK SERVER-SIDE RENDERING (SSR)
// Mengarahkan bot/crawler ke layanan Prerender agar mendapatkan HTML penuh.
// =========================================================================
const prerender = require("prerender-node");
if (process.env.PRERENDER_TOKEN) {
  prerender.set("prerenderToken", process.env.PRERENDER_TOKEN);
}
// Tambahan bot yang spesifik (optional, default prerender-node sudah cukup komplit)
prerender.crawlerUserAgents.push("whatsapp", "telegrambot", "linkedinbot");
app.use(prerender);
// =========================================================================

const mainRouter = require("./routes/index");


app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("API Exaque v1.0 is running...");
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});