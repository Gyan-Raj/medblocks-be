// models\User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "github", "local"],
      required: true,
    },
    providerId: { type: String }, // not required — local users don't have one
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    password: { type: String }, // hashed — only set for local users
  },
  { timestamps: true },
);

userSchema.index(
  { provider: true, providerId: true },
  { unique: true, sparse: true },
);
userSchema.index({ email: true }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
