const express = require("express");
const { PORT } = require("./env.constants");
const app = express();

app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});

app.get("/", (req, res) => {
  res.send("Healthy");
});
