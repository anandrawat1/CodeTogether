const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            if(!email || !password) {
                return res.status(401).json({
                    success: false,
                    message: "All fields are required.",
                })
            }
    
            const user = await User.findOne({email: email});
    
            if(!user) {
                return res.status(401).json({
                    success: false,
                    message: "User is not registered, please sign up first",
                })
            }
    
            // create jwt token
    
            if(await bcrypt.compare(password, user.password)) {
    
                const payload = {
                    email: user.email,
                    id: user._id,
                }
                
                const JWT_SECRET = process.env.JWT_SECRET;
                
                const token = jwt.sign(payload, JWT_SECRET, {
                    expiresIn: "2h",
                })
    
                user.token = token;
                user.password = undefined;
    
                const options  = {
                    expire: Date.now() + 3 * 24 * 60 * 60 * 1000,
                }
    
                res.cookie("token", token, options).status(200).json({
                    success: true,
                    token: token, 
                    user: user,
                    message: "Logged in successfully",
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Password is incorrect",
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Login failure, please try again",
            })
        }
    },
    signup: async(req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            if(!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please Fill All The Details"
                })
            }
            const existingUser = await User.findOne({email: email});
            if(existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User is already registered"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                firstName, 
                lastName, 
                email, 
                password: hashedPassword, 
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            })
    
            res.status(200).json({
                success: true,
                message: "User is registered successfully",
                user: user,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "User cannot be registered, Please try again later!"
            })
        }
        
    }
}

module.exports = auth;