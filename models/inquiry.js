"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Inquiry extends Model {
    static associate(models) {
      
    }
  }
  Inquiry.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      job_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_persona: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      
      service_needed: {
        type: DataTypes.ENUM(
          "Berbicara Dengan Sales",
          "Permintaan Demo",
          "Bantuan Teknis",
          "Lokasi Kantor Exaque"
        ),
        allowNull: false,
      },
      
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("new", "contacted", "resolved", "spam"),
        allowNull: false,
        defaultValue: "new",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Inquiry",
      tableName: "Inquiries",
      timestamps: false,
    }
  );
  return Inquiry;
};
