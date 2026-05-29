// routes\auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONTEND_URL,
} = require("../env.constants");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const issueTokenCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required for SameSite: None
    sameSite: "none", // allows cross-site (Vercel ↔ Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    issueTokenCookie(res, req.user);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  },
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${FRONTEND_URL}/login?error=github_failed`,
    session: false,
  }),
  (req, res) => {
    issueTokenCookie(res, req.user);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  },
);

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  try {
    const existing = await User.findOne({ email, provider: "local" });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      provider: "local",
      name,
      email,
      password: hashed,
      avatar: null, // frontend renders initials instead
    });

    issueTokenCookie(res, user);
    res.status(201).json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// ── Local Login ───────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email, provider: "local" });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    issueTokenCookie(res, user);
    res.json({ message: "Logged in" });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none", // must match the original Set-Cookie attributes
  });
  res.json({ message: "Logged out" });
});

module.exports = router;
