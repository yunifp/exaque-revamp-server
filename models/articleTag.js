"use strict";
const { Model } = require("sequelize");



const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {
    static associate(models) {
      
      

      ArticleTag.belongsToMany(models.Article, {
        through: "ArticleTagPivot", 
        foreignKey: "article_tag_id",
        otherKey: "article_id",
        as: "articles",
      });
    }
  }

  ArticleTag.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "ArticleTag",
      tableName: "ArticleTags",
      hooks: {
        
        beforeCreate: (tag) => {
          if (tag.name) {
            tag.slug = generateSlug(tag.name);
          }
        },
        
        beforeUpdate: (tag) => {
          if (tag.changed("name")) {
            
            tag.slug = generateSlug(tag.name);
          }
        },
      },
    }
  );
  return ArticleTag;
};

