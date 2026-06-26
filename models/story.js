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
  class Story extends Model {
    
    static associate(models) {
      Story.belongsTo(models.User, { foreignKey: "author_id", as: "author" });
      Story.belongsToMany(models.StoryCategory, {
        through: "StoryCategoryPivot",
        foreignKey: "story_id",
        otherKey: "story_category_id",
        as: "categories",
      });
      Story.belongsToMany(models.StoryTag, {
        through: "StoryTagPivot",
        foreignKey: "story_id",
        otherKey: "story_tag_id",
        as: "tags",
      });
    }
  }

  Story.init(
    {
      
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      excerpt: { type: DataTypes.TEXT, allowNull: true },
      featured_image_url: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      published_at: { type: DataTypes.DATE, allowNull: true },
      author_id: { type: DataTypes.INTEGER, allowNull: false },
      author_override: { type: DataTypes.STRING, allowNull: true },
      meta_title: { type: DataTypes.STRING, allowNull: true },
      meta_description: { type: DataTypes.TEXT, allowNull: true },
      canonical_url: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Story",
      tableName: "Stories",
    }
  );
  return Story;
};
