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
  class ArticleCategory extends Model {
    static associate(models) {
      
      
      

      ArticleCategory.belongsToMany(models.Article, {
        through: "ArticleCategoryPivot", 
        foreignKey: "article_category_id",
        otherKey: "article_id",
        as: "articles",
      });
    }
  }

  ArticleCategory.init(
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
      modelName: "ArticleCategory",
      tableName: "ArticleCategories",
      hooks: {
        
        beforeCreate: (category) => {
          if (category.name) {
            category.slug = generateSlug(category.name);
          }
        },
        
        beforeUpdate: (category) => {
          if (category.changed("name")) {
            
            category.slug = generateSlug(category.name);
          }
        },
      },
    }
  );
  return ArticleCategory;
};
