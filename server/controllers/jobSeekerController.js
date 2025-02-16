const JobSeekerPost = require('../models/JobSeekerPost');

// Create a new job seeker post
exports.createJobSeekerPost = async (req, res) => {
    try {
        const { title, description, expectedSalary, experienceYears, desiredLocation } = req.body;

        if (!title || !description || !expectedSalary || !experienceYears || !desiredLocation) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newJobSeekerPost = new JobSeekerPost({
            user: req.user.id,
            title,
            description,
            expectedSalary,
            experienceYears,
            desiredLocation
        });

        await newJobSeekerPost.save();
        res.status(201).json({ success: true, message: "Job seeker post created successfully", data: newJobSeekerPost });
    } catch (error) {
        console.error("Error creating job seeker post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all job seeker posts
exports.getAllJobSeekerPosts = async (req, res) => {
    try {
        const jobSeekerPosts = await JobSeekerPost.find().populate('user', 'firstname lastname email');
        res.status(200).json({ success: true, data: jobSeekerPosts });
    } catch (error) {
        console.error("Error fetching job seeker posts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get a single job seeker post by ID
exports.getJobSeekerPostById = async (req, res) => {
    try {
        const jobSeekerPost = await JobSeekerPost.findById(req.params.id).populate('user', 'firstname lastname email');
        if (!jobSeekerPost) {
            return res.status(404).json({ success: false, message: "Job seeker post not found" });
        }
        res.status(200).json({ success: true, data: jobSeekerPost });
    } catch (error) {
        console.error("Error fetching job seeker post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update a job seeker post
exports.updateJobSeekerPost = async (req, res) => {
    try {
        const { title, description, expectedSalary, experienceYears, desiredLocation } = req.body;
        const jobSeekerPost = await JobSeekerPost.findById(req.params.id);

        if (!jobSeekerPost) {
            return res.status(404).json({ success: false, message: "Job seeker post not found" });
        }

        if (jobSeekerPost.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        jobSeekerPost.title = title || jobSeekerPost.title;
        jobSeekerPost.description = description || jobSeekerPost.description;
        jobSeekerPost.expectedSalary = expectedSalary || jobSeekerPost.expectedSalary;
        jobSeekerPost.experienceYears = experienceYears || jobSeekerPost.experienceYears;
        jobSeekerPost.desiredLocation = desiredLocation || jobSeekerPost.desiredLocation;

        await jobSeekerPost.save();
        res.status(200).json({ success: true, message: "Job seeker post updated successfully", data: jobSeekerPost });
    } catch (error) {
        console.error("Error updating job seeker post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete a job seeker post
exports.deleteJobSeekerPost = async (req, res) => {
    try {
        const jobSeekerPost = await JobSeekerPost.findById(req.params.id);

        if (!jobSeekerPost) {
            return res.status(404).json({ success: false, message: "Job seeker post not found" });
        }

        if (jobSeekerPost.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await jobSeekerPost.deleteOne();
        res.status(200).json({ success: true, message: "Job seeker post deleted successfully" });
    } catch (error) {
        console.error("Error deleting job seeker post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
