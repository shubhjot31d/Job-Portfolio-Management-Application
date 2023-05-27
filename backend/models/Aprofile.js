const mongoose = require('mongoose');

const AprofileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    skills: {
        type: [String],
        required: true
    },
    education: [
        {
            school: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
        }
    ],
    applications: [
        {
            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'job'
            },
            rejected: {
                type: Boolean,
                default: false
            },
            shortlisted: {
                type: Boolean,
                default: false
            },
            accepted: {
                type: Boolean,
                default: false
            },
            dateofjoining: {
                type: Date
            },
            dateofapplication: {
                type: Date,
            },
            sop: {
                type: String
            }
        }
    ],
    rating: {
        type: String,
    },
    ratings: [
        {
            rater: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            rate: {
                type: String
            }
        }
    ]
});

module.exports = Aprofile = mongoose.model('aprofile', AprofileSchema)