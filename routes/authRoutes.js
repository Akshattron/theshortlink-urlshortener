const { Router } = require("express");
const { signup, login } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = {
    authRouter
};