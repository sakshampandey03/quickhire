const ContactInfo = require('../models/ContactInfo');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.createContactInfo = async (req, res) => {
    try {
        const { address, city, state, pincode, phone, user } = req.body;
        // ensure user is logged in using middleware
        const token = req.cookies.token;
        if(!token){
            return res.status(403).json({
                success: false,
                message: "Unauthorized cant find token in cookie in createinfo"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id =  decoded.id ;
        // Validate required fields
        if (!address || !city || !state || !pincode || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new contact info document
        const newContactInfo = new ContactInfo({
            address,
            city,
            state,
            pincode,
            phone,
            user
        });

        // Save to database
        const savedContactInfo = await newContactInfo.save();
        const newId = savedContactInfo._id;
        await User.findByIdAndUpdate
        (user_id, { $set: { contactInfo: newId } }, { new: true, runValidators: true });
        res.status(201).json(savedContactInfo);
        
    } catch (error) {
        console.log("error in auth contactinfo controller ", error);
        res.status(500).json({ message: error.message });
    }
};



// havent checked this yet check it later
exports.updateContactInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedContactInfo = await ContactInfo.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedContactInfo) {
            return res.status(404).json({ message: "Contact Info not found" });
        }

        res.status(200).json(updatedContactInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

