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
// FITUR INTERSEPSI: INJEKSI META TAG UNTUK SEMUA BOT SOSMED
// =========================================================================
app.get("/blog/:slug", async (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  
  // Deteksi bot WhatsApp, FB, Twitter/X, LinkedIn, Telegram, Discord, dll.
  const isBot = /whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|discordbot|embedly|baiduspider|pinterest|slackbot|vkShare|facebot|outbrain|W3C_Validator/i.test(userAgent);

  const frontendUrl = process.env.FRONTEND_URL || "https://exaque.com";

  // 1. Jika yang akses MANUSIA (browser), langsung lempar ke web React
  if (!isBot) {
    return res.redirect(`${frontendUrl}/blog/${req.params.slug}`);
  }

  // 2. Jika yang akses BOT, buatkan HTML mentah secara instan
  try {
    const { slug } = req.params;
    const article = await articleRepo.findArticleBySlug(slug);

    // Data default jika slug tidak ditemukan di database
    let title = "Blog Exaque";
    let description = "Temukan wawasan, tren industri, dan praktik terbaik dari para ahli kami.";
    let imageUrl = `${process.env.APP_URL || "https://exaque.com"}/logo-helmet.svg`;
    let currentUrl = `${frontendUrl}/blog`;

    if (article) {
      title = article.meta_title || article.title;
      description = article.meta_description || "Layanan Berbasis AI Exaque";
      currentUrl = `${frontendUrl}/blog/${slug}`;
      
      // Susun URL gambar agar absolute (https://...)
      if (article.featured_image_url) {
        imageUrl = article.featured_image_url.startsWith("https")
          ? article.featured_image_url
          : `${process.env.APP_URL || `http://localhost:${PORT}`}${article.featured_image_url}`;
      }
    }

    // HTML khusus yang sangat ringan, hanya untuk dibaca oleh Bot Sosmed
    const botHtml = `
      <!doctype html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <meta name="description" content="${description}" />
          
          <meta property="og:type" content="article" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${currentUrl}" />
          <meta property="og:site_name" content="Exaque" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
        </head>
        <body>
          <h1>${title}</h1>
          <p>${description}</p>
          <img src="${imageUrl}" alt="${title}" />
        </body>
      </html>
    `;

    return res.send(botHtml);
  } catch (error) {
    console.error("Gagal memproses OG Tags untuk Bot:", error);
    return res.status(500).send("Internal Server Error");
  }
});
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