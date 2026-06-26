const articleService = require("../services/articleService");

const createArticle = async (req, res) => {
  try {
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.categories && typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }

    const data = {
      ...req.body,
      author_id: req.user.id,
    };

    const newArticle = await articleService.createArticle(data, req.files);
    return res.success(newArticle, "Artikel berhasil dibuat.", 201);
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.categories && typeof req.body.categories === "string") {
      req.body.categories = JSON.parse(req.body.categories);
    }

    const updatedArticle = await articleService.updateArticle(
      id,
      req.body,
      req.files
    );
    return res.success(updatedArticle, "Artikel berhasil diperbarui.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

const getAllArticles = async (req, res) => {
  try {
    const articles = await articleService.getAllArticles(req.query);
    return res.success(articles, "Artikel berhasil diambil.");
  } catch (error) {
    return res.error(error.message, 500);
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await articleService.getArticleBySlug(slug);
    return res.success(article, "Artikel berhasil diambil.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await articleService.deleteArticle(id);
    return res.success(null, "Artikel berhasil dihapus.");
  } catch (error) {
    if (error.message.includes("tidak ditemukan")) {
      return res.error(error.message, 404);
    }
    return res.error(error.message, 500);
  }
};

module.exports = {
  createArticle,
  updateArticle,
  getAllArticles,
  getArticleBySlug,
  deleteArticle,
};