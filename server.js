// server.js
const express = require("express");
const connectDB = require("./db/config");
const { PORT } = require("./env.constants");

const app = express();
connectDB();

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

app.get("/", (req, res) => {
  res.send("Healthy");
});
