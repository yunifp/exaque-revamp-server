"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleCategoryPivot extends Model {
    static associate(models) {
      
      
      ArticleCategoryPivot.belongsTo(models.Article, {
        foreignKey: "article_id",
      });
      ArticleCategoryPivot.belongsTo(models.ArticleCategory, {
        foreignKey: "article_category_id",
      });
    }
  }

  ArticleCategoryPivot.init(
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Articles",
          key: "id",
        },
      },
      article_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "ArticleCategories",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ArticleCategoryPivot",
      tableName: "ArticleCategoryPivot",
    }
  );
  return ArticleCategoryPivot;
};
