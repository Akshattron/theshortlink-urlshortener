const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    urlCode: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
});

// UrlModel:
const UrlModel = mongoose.model("urls" , UrlSchema)

module.exports = {
    UrlModel: UrlModel
}