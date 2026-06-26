const db = require("../models");
const { Article, User, ArticleCategory, ArticleTag } = db;

// Pilihan 'include' standar untuk mengambil relasi
const includeAssociations = [
  { model: User, as: "author", attributes: ["id", "name"] },
  { model: ArticleCategory, as: "categories", through: { attributes: [] } },
  { model: ArticleTag, as: "tags", through: { attributes: [] } },
];

const createArticle = async (data, transaction) => {
  return await Article.create(data, { transaction });
};

const updateArticle = async (id, data, transaction) => {
  return await Article.update(data, {
    where: { id },
    transaction,
  });
};

const findArticleById = async (id) => {
  return await Article.findByPk(id, {
    include: includeAssociations,
  });
};

const findArticleBySlug = async (slug) => {
  return await Article.findOne({
    where: { slug },
    include: includeAssociations,
  });
};

const deleteArticleById = async (id) => {
  return await Article.destroy({ where: { id } });
};

const findAllArticles = async (options) => {
  // 'options' akan berisi { where, limit, offset, order, include }
  return await Article.findAndCountAll(options);
};

module.exports = {
  createArticle,
  updateArticle,
  findArticleById,
  findArticleBySlug,
  deleteArticleById,
  findAllArticles,
  includeAssociations, // Export agar service bisa pakai
};
