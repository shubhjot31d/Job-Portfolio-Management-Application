const mongoose = require('mongoose');

const RprofileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    contactno: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
});

module.exports = Rprofile = mongoose.model('rprofile', RprofileSchema)