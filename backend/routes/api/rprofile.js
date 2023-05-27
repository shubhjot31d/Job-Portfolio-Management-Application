const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Rprofile = require('../../models/Rprofile');
const User = require('../../models/User');

// @route       GET api/rprofile/me
// @desc        GET Current User (recruiter) Profile
// @access      Private

router.get('/me', auth, async (req, res) => {
    try {
        const rprofile = await Rprofile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!rprofile) {
            return res.status(400).json({ msg: 'There is no profile for this applicant' });
        }
        res.json(rprofile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST api/rprofile
// @desc        Create or Update Recruiter profile
// @access      Private

router.post('/', [auth, [
    check('contactno', 'Contact No. is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        contactno,
        bio
    } = req.body;

    const rprofileFields = {};
    rprofileFields.user = req.user.id;
    if (contactno) rprofileFields.contactno = contactno;
    if (bio) rprofileFields.bio = bio;

    try {
        let rprofile = await Rprofile.findOne({ user: req.user.id });
        if (rprofile) {
            rprofile = await Rprofile.findOneAndUpdate(
                { user: req.user.id },
                { $set: rprofileFields },
                { new: true }
            );
            return res.json(rprofile);
        }
        rprofile = new Rprofile(rprofileFields);
        await rprofile.save();
        return res.json(rprofile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router; 