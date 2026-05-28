const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  BACKEND_URL,
} = require("../env.constants");

// ── Google ──────────────────────────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { provider: "google", providerId: profile.id },
          {
            name: profile.displayName,
            email: profile.emails?.[0]?.value ?? null,
            avatar: profile.photos?.[0]?.value ?? null,
          },
          { upsert: true, new: true },
        );
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

// ── GitHub ───────────────────────────────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { provider: "github", providerId: profile.id },
          {
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value ?? null,
            avatar: profile.photos?.[0]?.value ?? null,
          },
          { upsert: true, new: true },
        );
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

module.exports = passport;
