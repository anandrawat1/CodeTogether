const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalAuth = async(req, res, next) => {
    try {
        const token = req?.body?.token || req?.cookies?.token || req?.header("Authorization")?.replace("Bearer ", "");
        if(!token) {
            // If no token, just continue without setting req.user
            console.log("No token, continuing as unauthenticated user");
            return next();
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            // If token is invalid, just continue without setting req.user
            console.log("Invalid token, continuing as unauthenticated user");
        }
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = optionalAuth; 