const User = require('../models/User');


exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('contactInfo');
        if(!user){
            return res.status(403).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("something wrong while getting current user ", error);
    }  
}

const bcrypt = require('bcrypt');

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // Prevent email from being updated directly
        if (updateData.email || updateData.password) {
            return res.status(400).json({ message: "Email or Password cannot be updated" });
        }

        // Hash the password if it is being updated
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




