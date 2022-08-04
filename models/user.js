const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    nickname: { type: String, default: "" },
    birthday: { type: Date, default: Date.now },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    username: { type: String, unique: true },
    password: String,
    salt: String,
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entry" }],
  },
  {
    collection: "users",
    methods: {
      setPassword(password) {
        this.salt = crypto.randomBytes(16).toString("hex");
        this.password = crypto
          .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
          .toString("hex");
      },
      validatePassword(password) {
        const hash = crypto
          .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
          .toString("hex");
        return this.password === hash;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
