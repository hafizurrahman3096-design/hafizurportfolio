const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    full_name: String,
    bio: String,
    email: String,
    location: String,
    avatar_url: String,
    profile_photo_url: String
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
