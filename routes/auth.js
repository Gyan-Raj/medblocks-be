const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONTEND_URL,
} = require("../env.constants");

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
