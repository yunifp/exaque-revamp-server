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
  class StoryCategory extends Model {
    static associate(models) {
      
      

      StoryCategory.belongsToMany(models.Story, {
        through: "StoryCategoryPivot", 
        foreignKey: "story_category_id",
        otherKey: "story_id",
        as: "stories",
      });
    }
  }

  StoryCategory.init(
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
      modelName: "StoryCategory",
      tableName: "StoryCategories",
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
  return StoryCategory;
};
