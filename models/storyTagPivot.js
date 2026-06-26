"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StoryTagPivot extends Model {
    static associate(models) {
      
      StoryTagPivot.belongsTo(models.Story, { foreignKey: "story_id" });
      StoryTagPivot.belongsTo(models.StoryTag, { foreignKey: "story_tag_id" });
    }
  }

  StoryTagPivot.init(
    {
      story_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Stories",
          key: "id",
        },
      },
      story_tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "StoryTags",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "StoryTagPivot",
      tableName: "StoryTagPivot",
    }
  );
  return StoryTagPivot;
};
