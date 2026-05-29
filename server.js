// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/config");
const authRoutes = require("./routes/auth");
const { PORT, FRONTEND_ALLOWED_ORIGINS } = require("./env.constants");

const app = express();
connectDB();

app.use(
  cors({
    origin: FRONTEND_ALLOWED_ORIGINS.split(","),
    credentials: true, // required for cookies
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (_req, res) => res.send("Healthy"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
