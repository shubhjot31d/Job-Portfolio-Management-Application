const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const auth = require('../../middleware/auth');

const Aprofile = require('../../models/Aprofile');
const User = require('../../models/User');
const Job = require('../../models/Job');
const { findById } = require('../../models/Aprofile');

// @route       GET api/aprofile/me
// @desc        GET Current User (applicant) Profile
// @access      Private

router.get('/me', auth, async (req, res) => {
    try {
        const aprofile = await Aprofile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!aprofile) {
            return res.status(400).json({ msg: 'There is no profile for this applicant' });
        }
        res.json(aprofile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/aprofile/aprofiles/recruiter
// @desc        get all aprofiles accepted by recruiter
// @access      private

router.get('/aprofiles/recruiter', auth, async (req, res) => {
    try {
        let jobs = await Job.find({ user: req.user.id });
        let aprofiles = await Aprofile.find().populate([
            {
                path: "user",
                select: ["name", "email"],
                model: User
            },
            {
                path: "applications.job",
                select: ["title", "typeofjob"],
                model: Job
            }
        ]);
        // for (var i = 0; i < aprofiles.length; i++) {
        //     console.log(aprofiles[i].applications);
        // }
        aprofiles = aprofiles.filter(function (aprofile) {
            for (i = 0; i < jobs.length; i++) {
                if (aprofile.applications.filter(app => app.job._id.toString() === jobs[i]._id.toString() && app.accepted === true).length > 0) {
                    return true
                }
            }
            return false
        });

        res.json(aprofiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/aprofile/aprofiles/job/:jobId
// @desc        get all aprofiles with given jobId
// @access      private

router.get('/aprofiles/job/:jobId', auth, async (req, res) => {
    try {
        let aprofiles = await Aprofile.find().populate('user', ['name', 'email']);
        aprofiles = aprofiles.filter(function (aprofile) {
            if (aprofile.applications.filter(app => app.job.toString() === req.params.jobId).length > 0) {
                return true;
            }
            else {
                return false;
            }
        });
        res.json(aprofiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       POST api/aprofile/skills
// @desc        POST Add applicant skills
// @access      Private

router.post('/skills', [auth, [
    check('skills').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { skills } = req.body;

    const aprofileFields = {};
    aprofileFields.user = req.user.id;
    if (skills) {
        aprofileFields.skills = skills.split(',').map(skills => skills.trim());
    }

    try {
        let aprofile = await Aprofile.findOne({ user: req.user.id });

        if (aprofile) {
            //Update 
            aprofile = await Aprofile.findOneAndUpdate(
                { user: req.user.id },
                { $set: aprofileFields },
                { new: true }
            );
            return res.json(aprofile);
        }
        aprofileFields.rating = '0';
        // Create
        aprofile = new Aprofile(aprofileFields);
        await aprofile.save()
        return res.json(aprofile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/aprofile/education
// @desc        add profile education
// @access      private

router.put('/education', [auth, [
    check('school', 'school is required.').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('fieldofstudy', 'field of study is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array });
    }
    const {
        school,
        fieldofstudy,
        from,
        to,
        current,
    } = req.body;

    const newEdu = {
        school,
        fieldofstudy,
        from,
        to,
        current,
    }
    try {
        const aprofile = await Aprofile.findOne({ user: req.user.id });
        if (!aprofile) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        aprofile.education.unshift(newEdu);

        await aprofile.save();
        return res.json(aprofile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       PUT api/aprofile/application
// @desc        add profile application
// @access      private

router.put('/application', [auth, [
    check('sop', 'SOP is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array });
    }
    const {
        id,
        sop
    } = req.body;

    const newJob = {
        job: id,
        rejected: false,
        shortlisted: false,
        accepted: false,
        dateofapplication: Date.now(),
        dateofjoining: null,
        sop: sop
    }
    try {
        const aprofile = await Aprofile.findOne({ user: req.user.id });
        if (!aprofile) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        aprofile.applications.unshift(newJob);

        await aprofile.save();
        return res.json(aprofile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       PUT api/aprofile/job/reject/:jobId/:aprofileId
// @desc        Reject Job application
// @access      private

router.put('/job/reject/:jobId/:aprofileId', auth, async (req, res) => {
    try {
        const aprofile = await Aprofile.findById(req.params.aprofileId);
        const jobIndex = aprofile.applications.findIndex(function (app) {
            return app.job.toString() === req.params.jobId
        })
        if (jobIndex === -1) {
            return res.status(404).json({ msg: 'No Job Found' });
        }
        aprofile.applications[jobIndex].rejected = true;
        aprofile.applications[jobIndex].shortlisted = false;
        aprofile.applications[jobIndex].accepted = false;

        const job = await Job.findById(req.params.jobId);
        const appIndex = job.applications.findIndex(function (app) {
            return app.applicant.toString() === aprofile.user.toString()
        })

        if (appIndex === -1) {
            return res.status(404).json({ msg: 'No Applicant found' });
        }
        job.applications[appIndex].reject = true;
        job.applications[appIndex].shortlist = false;
        job.applications[appIndex].accepted = false;

        await aprofile.save();
        await job.save();
        res.json({ msg: 'Application Rejected' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/aprofile/job/shortlist/:jobId/:aprofileId
// @desc        Shortlist Job application
// @access      private

router.put('/job/shortlist/:jobId/:aprofileId', auth, async (req, res) => {
    try {
        const aprofile = await Aprofile.findById(req.params.aprofileId);
        const jobIndex = aprofile.applications.findIndex(function (app) {
            return app.job.toString() === req.params.jobId
        })
        if (jobIndex === -1) {
            return res.status(404).json({ msg: 'No Job Found' });
        }
        aprofile.applications[jobIndex].rejected = false;
        aprofile.applications[jobIndex].shortlisted = true;
        aprofile.applications[jobIndex].accepted = false;

        const job = await Job.findById(req.params.jobId);
        const appIndex = job.applications.findIndex(function (app) {
            return app.applicant.toString() === aprofile.user.toString()
        })

        if (appIndex === -1) {
            return res.status(404).json({ msg: 'No Applicant found' });
        }
        job.applications[appIndex].reject = false;
        job.applications[appIndex].shortlist = true;
        job.applications[appIndex].accepted = false;

        await aprofile.save();
        await job.save();
        res.json({ msg: 'Application Shortlisted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/aprofile/job/Accept/:jobId/:aprofileId
// @desc        Accept Job application
// @access      private

router.put('/job/accept/:jobId/:aprofileId', auth, async (req, res) => {
    try {
        const aprofile = await Aprofile.findById(req.params.aprofileId).populate('user', ['name', 'email']);
        const jobIndex = aprofile.applications.findIndex(function (app) {
            return app.job.toString() === req.params.jobId
        })
        if (jobIndex === -1) {
            return res.status(404).json({ msg: 'No Job Found' });
        }

        // reject all applications
        for (var i = 0; i < aprofile.applications.length; i++) {
            aprofile.applications[i].rejected = true;
            aprofile.applications[i].shortlisted = false;
            aprofile.applications[i].accepted = false;
        }

        // accept selected application
        aprofile.applications[jobIndex].rejected = false;
        aprofile.applications[jobIndex].shortlisted = false;
        aprofile.applications[jobIndex].accepted = true;
        aprofile.applications[jobIndex].dateofjoining = Date.now();


        // rejected all applications
        const jobs = await Job.find();
        for (var i = 0; i < jobs.length; i++) {
            for (var j = 0; j < jobs[i].applications.length; j++) {
                if (jobs[i].applications[j].applicant.toString() === aprofile.user.toString()) {
                    jobs[i].applications[j].reject = true;
                    jobs[i].applications[j].shortlist = false;
                    jobs[i].applications[j].accepted = false;
                }
            }
            await jobs[i].save();
        }

        //await jobs.save();

        // accept selected application
        const job = await Job.findById(req.params.jobId);
        const appIndex = job.applications.findIndex(function (app) {
            return app.applicant.toString() === aprofile.user._id.toString()
        })

        if (appIndex === -1) {
            return res.status(404).json({ msg: 'No Applicant found' });
        }
        job.applications[appIndex].reject = false;
        job.applications[appIndex].shortlist = false;
        job.applications[appIndex].accepted = true;

        // send email

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'username',
                pass: 'password'
            }
        });

        let mailDetails = {
            from: 'username',
            to: aprofile.user.email,
            subject: 'Accepted Email',
            text: 'Congrats you are accepted for your job application' + job.title
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });

        await aprofile.save();
        await job.save();
        res.json({ msg: 'Application Accepted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/aprofile/rate/:aprofileId
// @desc        Rate applicant
// @access      private

router.put('/rate/:aprofileId', [auth, [
    check('rate').not().isEmpty().isIn(['0', '1', '2', '3', '4', '5'])
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array });
    }
    const { rate } = req.body;
    const newRating = {
        rater: req.user.id,
        rate
    };
    try {
        const aprofile = await Aprofile.findById(req.params.aprofileId);
        if (!aprofile) {
            return res.status(404).json({ msg: 'No Profile for this ID' });
        }
        if (aprofile.ratings.filter(rating => rating.rater.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'The Applicant is already rated by you' });
        }
        aprofile.ratings.unshift(newRating);

        let krate = 0;
        for (var i = 0; i < aprofile.ratings.length; i++) {
            krate = krate + parseInt(aprofile.ratings[i].rate);
        }
        krate = krate / aprofile.ratings.length;
        aprofile.rating = krate.toString();

        await aprofile.save();
        res.json(aprofile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});


module.exports = router;
