const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname , email, password, confirmPassword , role , otp} = req.body;
    if (!firstname || !lastname || !email || !password || !confirmPassword || !role || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already exists" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const recentOtp = await Otp.findOne({ email }).sort({createdAt : -1}).limit(1);
    console.log("most recent otp is ", recentOtp);
    if (recentOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashPass = await bcrypt.hashSync(password, 10);
    const userPayload = {
        firstname,
        lastname,
        email,
        password: hashPass,
        role,
        image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstname}+${lastname}`,
    }


    const user = await User.create(userPayload);
    return res.status(201).json({ message: "User created successfully" , user});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error while signing up" });
  }
};


// login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Fill all details"
            })
        }
        const user =await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            })
        }
        
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                role : user.role,
            }
            const token =  jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn : "2h",
            });
            user.password = undefined;
            // generate cookies
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
            }
            res.cookie("token", token, options).status(200).json({
                success : true, 
                token,
                user,
                message :"logged in successfully",
            })

        }
        else{
            return res.status(403).json({
                success: false,
                message: "Incorrect Password"
            })
        } 

    } catch (error) {
        console.error("something wrong while logging in ", error);
    }   

}

exports.logout = (req, res) => {
    // remove token from cookies
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("error while logging out ", error);
    }
};


// changePassword

exports.changePassword = async (req, res) =>{
    try {
        const {id, oldPassword, newPassword, confirmPassword} = req.body;
        if(!id || !oldPassword || !newPassword || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Enter all the details"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Password do not match"
            })
        }
        const newHashed= bcrypt.hash(newPassword, 10);
        const response = await User.findOneAndUpdate({_id : id}, {Password : newHashed}, {
            new : true
        })
        const formattedDate = new Date().toLocaleString();


        const content =  `<h1>Your Password has been reset at ${formattedDate}</h1>`;
        const email = await User.findById(id).select("email");
        mailSender(email, "Password Changed", content);
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            response,
        })

    } catch (error) {
        console.log("error while changing password ", error);
    }
}

// generate otp
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const userPresent = await User.findOne({email});
        if(userPresent){
            return res.status(400).json({ error: "Email already exists" });
        }
        const otp = otpGenerator.generate(6, {
            upperCase: false,
            specialChars: false,
            alphabets: false,
        });
        // const otp = "123456";
        const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);    
        if (recentOtp) {
            recentOtp.otp = otp;
            await recentOtp.save();
        } else {
            await Otp.create({ email, otp });
        }
        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.log("error while generating otp", error);
        return res.status(500).json({ error: "error while generating otp" });
    }
}