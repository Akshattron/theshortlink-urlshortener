const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        next();
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);
        
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authMiddleware
};