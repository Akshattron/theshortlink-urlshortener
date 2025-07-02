const { UrlModel } = require('../models/urlModel');
const shortid = require('shortid');

const shortenUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        
        // Generate short code
        const urlCode = shortid.generate();
        const shortUrl = `${baseUrl}/${urlCode}`;

        // Create URL document
        const url = new UrlModel({
            longUrl,
            shortUrl,
            urlCode,
            user: req.user?._id || null
        });

        await url.save();

        res.json({ shortUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { urlCode } = req.params;
        const url = await UrlModel.findOne({ urlCode });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.redirect(url.longUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserUrls = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const urls = await UrlModel.find({ user: req.user._id }).sort({ date: -1 });
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    shortenUrl,
    redirectUrl,
    getUserUrls
};