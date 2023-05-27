const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Job = require('../../models/Job');
const User = require('../../models/User');
const Aprofile = require('../../models/Aprofile');

// @route       GET api/job
// @desc        GET all active jobs
// @access      Public
router.get('/', async (req, res) => {
    try {
        let Jobs = await Job.find().populate('user', ['name', 'email']);
        Jobs = Jobs.filter(job => job.deadline > Date.now());
        res.json(Jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route      GET api/job/myapplications
// @desc       application for the job
// @access     Private

router.get('/myapplications', auth, async (req, res) => {
    try {
        let jobs = await Job.find().populate('user', ['name', 'email']);
        //console.log(jobs);
        let aprofile = await Aprofile.findOne({ user: req.user.id });
        //console.log(aprofile);
        jobs = jobs.filter(function (job) {
            if (aprofile.applications.filter(app => app.job.toString() === job._id.toString()).length > 0) {
                return true
            }
            else {
                return false
            }
        });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route      GET api/job/recruiter
// @desc       Jobs made by recruiters
// @access     Private

router.get('/recruiter', auth, async (req, res) => {
    try {
        let jobs = await Job.find({ user: req.user.id }).populate('user', ['name', 'email']);
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route       GET api/job/:id
// @desc        GET job by id
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('user', ['name', 'email']);
        if (!job) {
            return res.status(404).json({ msg: 'No job for given Id' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route      POST api/job
// @desc       POST a job
// @access     Private
router.post('/', [auth, [
    check('title', 'Title is Required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty(),
    check('typeofjob', 'Type of Job is required').not().isEmpty(),
    check('salary').not().isEmpty(),
    check('duration').not().isEmpty().isIn(['0', '1', '2', '3', '4', '5', '6']),
    check('application').not().isEmpty(),
    check('position').not().isEmpty(),
    check('deadline').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        title,
        application,
        position,
        deadline,
        skills,
        typeofjob,
        duration,
        salary,
    } = req.body;

    const jobFields = {};
    jobFields.user = req.user.id;
    if (title) jobFields.title = title;
    if (deadline) jobFields.deadline = deadline;
    if (typeofjob) jobFields.typeofjob = typeofjob;
    if (duration) jobFields.duration = duration;
    if (salary) jobFields.salary = salary;
    jobFields.maxap = {}
    if (application) jobFields.maxap.application = application;
    if (position) jobFields.maxap.position = position;
    if (skills) {
        jobFields.skills = skills.split(',').map(skills => skills.trim());
    }

    jobFields.rating = '0';

    try {
        let job = new Job(jobFields);
        await job.save();
        return res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route      PUT api/job/applications/:jobId
// @desc       application for the job
// @access     Private

router.put('/applications/:jobId', [auth, [
    check('sop', 'SOP is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { sop } = req.body;
    const newApplication = {
        applicant: req.user.id,
        sop,
        rejected: false,
        shortlisted: false,
        accepted: false
    }
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ msg: "No Job found" });
        }
        if (job.applications.filter(app => app.applicant.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Applicant Already Added" });
        }
        job.applications.unshift(newApplication);
        await job.save();
        // console.log(job);
        // console.log(job.applications);
        return res.json(job.applications);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})

// @route      PUT api/job/edit/:jobId
// @desc       Edit the Job
// @access     Private

router.put('/edit/:jobId', [auth, [
    check('application').not().isEmpty(),
    check('position').not().isEmpty(),
    check('deadline').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        application,
        position,
        deadline
    } = req.body;

    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'You can not edit this job' });
        }

        job.maxap.application = application;
        job.maxap.position = position;
        job.deadline = deadline;

        await job.save();
        res.json(job);

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})

// @route       PUT api/job/rate/:jobId
// @desc        Rate Job
// @access      private

router.put('/rate/:jobId', [auth, [
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
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ msg: 'No Job for this ID' });
        }
        if (job.ratings.filter(rating => rating.rater.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Job is already rated by you' });
        }
        job.ratings.unshift(newRating);

        let krate = 0;
        for (var i = 0; i < job.ratings.length; i++) {
            krate = krate + parseInt(job.ratings[i].rate);
        }
        krate = krate / job.ratings.length;
        job.rating = krate.toString();

        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route      PUT api/job/delete/:jobId
// @desc       Delete the Job
// @access     Private

router.delete('/delete/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ msg: 'No Job found' });
        }
        if (job.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'You can not delete this post' });
        }

        await Job.findOneAndRemove({ _id: req.params.jobId });

        res.json({ msg: 'Job is deleted' });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});




module.exports = router;