const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    emoji: String,
    log: String,
    dateCreated: Date,
}, {collection: "entries"});

module.exports = mongoose.model("Entry", entrySchema);