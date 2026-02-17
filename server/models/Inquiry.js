const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ['website', 'ml', 'other'],
        default: 'website'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'contacted'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
