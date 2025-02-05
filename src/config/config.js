require('dotenv').config();

const dbConfig = {
  development: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "",
    host: process.env.HOST || "",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "",
    host: process.env.HOST || "",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    
  },
  production: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "",
    host: process.env.HOST || "",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
};

module.exports = dbConfig;
