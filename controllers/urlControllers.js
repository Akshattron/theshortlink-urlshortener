const { nanoid } = require('nanoid');

const { UrlModel } = require("../models/urlModel"); // Importing the URL Model!

const baseUrl = `https://theshortlink.vercel.app`;

const shortenUrl = async (req, res) => {
    const { longUrl } = req.body; // Retriving the actual(long) URL from the body

    if (!longUrl) {
        return res.status(400).json({ message: 'Please provide a valid URL.' });
    }

    try {
        const urlCode = nanoid(6); // Generating a random 6-character code
        const existingUrl = await UrlModel.findOne({ longUrl });

        if (existingUrl) {
            return res.json(existingUrl); // Return if already exists
        }

        const shortUrl = `${baseUrl}/${urlCode}`;
        const newUrl = new UrlModel({ longUrl, shortUrl, urlCode });
        await newUrl.save();

        res.json(newUrl); // Will Catch the Short URL from this object in the Frontend!
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};


const redirectUrl = async (req, res) => {
    const { urlCode } = req.params; // Will retrive the /urlcode from the query parameter!

    try {
        const url = await UrlModel.findOne({ urlCode });

        if (!url) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        res.redirect(url.longUrl);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports = {
    shortenUrl: shortenUrl,
    redirectUrl: redirectUrl
}