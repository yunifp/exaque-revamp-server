"use strict";
const { Model } = require("sequelize");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: "author_id",
        as: "author",
      });
      Article.belongsToMany(models.ArticleCategory, {
        through: "ArticleCategoryPivot",
        foreignKey: "article_id",
        otherKey: "article_category_id",
        as: "categories",
      });
      Article.belongsToMany(models.ArticleTag, {
        through: "ArticleTagPivot",
        foreignKey: "article_id",
        otherKey: "article_tag_id",
        as: "tags",
      });
    }
  }

  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      featured_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      author_override: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      author_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      author_profile: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      author_quotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      canonical_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      author_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
    }
  );
  return Article;
};