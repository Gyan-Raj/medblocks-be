// env.constants.js
require("dotenv").config();

module.exports = Object.freeze({
  PORT: process.env.PORT,
  FRONTEND_ALLOWED_ORIGINS: process.env.FRONTEND_ALLOWED_ORIGINS,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // GitHub OAuth
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // App
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
});
