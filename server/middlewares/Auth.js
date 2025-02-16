const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
        } catch (error) {
            console.log("error in auth middleware", error);
            return res.status(403).json({
                success: false,
                message: "auth token is invalid"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
}

exports.jobSeeker = async (req, res, next) => {
    try {
        if (req.user.role === 'jobSeeker') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }
    } catch (error) {
        console.log("error in jobSeeker middleware", error);
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
}
exports.jobOfferer = async (req, res, next) => {
    try {
        if (req.user.role === 'jobOfferer') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }
    } catch (error) {
        console.log("error in jobOfferer middleware", error);
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
}
