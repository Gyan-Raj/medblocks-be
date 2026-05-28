require("dotenv").config();

module.exports = Object.freeze({
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING
});
