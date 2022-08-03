const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    nickname: String,
    birthday: Date,
    height: {type: Number, default: 0},
    weight: {type: Number, default: 0},
    username: String,
    password: String,
    entries: [{type: mongoose.Schema.Types.ObjectId, ref: "Entry"}],
}, {collection: "users"});

module.exports = mongoose.model("User", userSchema);