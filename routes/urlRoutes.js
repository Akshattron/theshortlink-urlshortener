const { Router } = require("express");
const { shortenUrl, redirectUrl, getUserUrls } = require('../controllers/urlController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const urlRouter = Router();

urlRouter.post('/shorten', authMiddleware, shortenUrl);
urlRouter.get('/:urlCode', redirectUrl);
urlRouter.get('/user/urls', authMiddleware, getUserUrls);

module.exports = {
    urlRouter
};