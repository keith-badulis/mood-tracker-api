const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    nickname: String,
    birthday: Date,
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    username: String,
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
