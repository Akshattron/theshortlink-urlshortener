const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    urlCode: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: Date.now }
});

const UrlModel = mongoose.model("urls", UrlSchema);

module.exports = {
    UrlModel
};