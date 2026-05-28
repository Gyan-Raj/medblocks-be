// db\config.js
const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("../env.constants");

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
