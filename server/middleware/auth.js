const jwt = require('jsonwebtoken');
const User = require('../models/User');

//User Authentication Middleware
const protect = async (req, res, next) => {

    console.log("AUTH HEADER:", req.headers.authorization);

    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if(token){
        try {
            console.log("TOKEN:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED:", decoded);

            req.user = await User.findById(decoded.id).select('-password');
            console.log("USER:", req.user);

            if (!req.user) {
                return res.status(401).json({
                    message: 'Not authorized, user not found'
                });
            }

            next();
        } catch (error) {
            console.log("JWT ERROR:", error.message);
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    } else {
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } 
    else {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
};

module.exports = { protect, admin };