require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Inquiry = require('./models/Inquiry');
const Profile = require('./models/Profile');

const app = express();
app.use(express.json());
app.use(cors());

// Configure Nodemailer (You'll need a real SMTP or ethereal account for production)
// For now, I'll set up a skeleton transporter. 
// You should add GMAIL_USER and GMAIL_PASS to your .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Portfolio API is running. Access the website at http://localhost:8081');
});

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// --- AUTH ROUTES ---

// Initial setup to create first admin (should be called only once)
app.post('/api/auth/setup', async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await Admin.findOne({ username });
    if (adminExists) return res.status(400).send('Admin already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    res.send('Admin created successfully');
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET || 'secretkey');
    res.json({ success: true, token });
});

// --- PROJECT ROUTES ---

app.get('/api/projects', async (req, res) => {
    const projects = await Project.find().sort('display_order');
    res.json(projects);
});

app.post('/api/projects', auth, async (req, res) => {
    const project = new Project(req.body);
    try {
        const savedProject = await project.save();
        res.json(savedProject);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(400).send(err);
    }
});

// --- INQUIRY ROUTES ---

app.get('/api/inquiries', auth, async (req, res) => {
    const inquiries = await Inquiry.find().sort('-createdAt');
    res.json(inquiries);
});

app.post('/api/inquiries', async (req, res) => {
    const inquiry = new Inquiry(req.body);
    try {
        await inquiry.save();

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'rahmanhafizur31928@gmail.com',
            subject: `New Project Inquiry from ${req.body.name}`,
            text: `
                You have a new inquiry:
                Name: ${req.body.name}
                Email: ${req.body.email}
                Project Type: ${req.body.projectType}
                Message: ${req.body.message}
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.patch('/api/inquiries/:id', auth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(inquiry);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/api/inquiries/:id', auth, async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inquiry deleted' });
    } catch (err) {
        res.status(400).send(err);
    }
});

// --- PROFILE ROUTES ---

app.get('/api/profile', async (req, res) => {
    let profile = await Profile.findOne();
    if (!profile) {
        // Return default profile if none exists
        profile = {
            full_name: "Hafizur Rahman",
            bio: "Web Developer & ML Enthusiast",
            email: "rahmanhafizur31928@gmail.com",
            location: "Bangladesh",
            avatar_url: ""
        };
    }
    res.json(profile);
});

app.put('/api/profile', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (profile) {
            profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
        } else {
            profile = new Profile(req.body);
            await profile.save();
        }
        res.json(profile);
    } catch (err) {
        res.status(400).send(err);
    }
});


const PORT = process.env.PORT || 5001;

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
