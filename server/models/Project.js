const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['web', 'ml', 'other'],
        default: 'web'
    },
    tags: [String],
    image_url: String,
    live_url: String,
    github_url: String,
    is_featured: {
        type: Boolean,
        default: false
    },
    display_order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
