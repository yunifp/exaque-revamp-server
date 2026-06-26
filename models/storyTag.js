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
  class StoryTag extends Model {
    static associate(models) {
      StoryTag.belongsToMany(models.Story, {
        through: "StoryTagPivot",
        foreignKey: "story_tag_id",
        otherKey: "story_id",
        as: "stories",
      });
    }
  }

  StoryTag.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "StoryTag",
      tableName: "StoryTags",
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
  return StoryTag;
};
