const express = require('express');
const UserInfo = require('../../models/UserInfo').UserInfo;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { Name, contact, crn, branch, batch, gender, admissionType } = req.body.formData;
        console.log("name", Name)
       
        const urn = req.body.urn
        const userInfo = await SignUpdata.findOne({ urn: urn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Create a new user profile object
        const newsignup = new UserInfo({
            Name,
            contact,
            crn,
            branch,
            batch,
            gender,
            admissionType
        });
       
        userInfo.userInfo = newsignup;
    
        const savedUserInfo = await userInfo.save();
        console.log(savedUserInfo);

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;