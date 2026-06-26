


require("dotenv").config();


if (!process.env.DB_USER) {
  
  console.error("ERROR: Variabel .env (seperti DB_USER) tidak ditemukan.");
  console.error("Pastikan file .env sudah ada di root folder server/");
  throw new Error("Missing database credentials in .env file");
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DEV_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER_PROD || process.env.DB_USER,
    password: process.env.DB_PASS_PROD || process.env.DB_PASS,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_HOST_PROD || process.env.DB_HOST,
    dialect: "mysql",
  },
};
