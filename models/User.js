const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "github", "local"],
      required: true,
    },
    providerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
  },
  { timestamps: true },
);

// Compound index — one user per provider
userSchema.index({ provider: true, providerId: true }, { unique: true });

module.exports = mongoose.model("User", userSchema);
