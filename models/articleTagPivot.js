"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleTagPivot extends Model {
    static associate(models) {
      // Definisikan relasi 'belongsTo'
      ArticleTagPivot.belongsTo(models.Article, { foreignKey: "article_id" });
      ArticleTagPivot.belongsTo(models.ArticleTag, {
        foreignKey: "article_tag_id",
      });
    }
  }

  ArticleTagPivot.init(
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
      article_tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "ArticleTags",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ArticleTagPivot",
      tableName: "ArticleTagPivot",
    }
  );
  return ArticleTagPivot;
};
