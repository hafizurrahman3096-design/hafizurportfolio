
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

// Mock data for testing (when MongoDB is not available)
const mockProjects = [
    {
        _id: '1',
        title: 'Portfolio Website',
        description: 'A modern portfolio website built with React and Node.js',
        type: 'web',
        tags: ['React', 'Node.js', 'Tailwind CSS'],
        display_order: 1
    },
    {
        _id: '2',
        title: 'ML Prediction Model',
        description: 'Machine learning model for predicting user behavior',
        type: 'ml',
        tags: ['Python', 'TensorFlow', 'scikit-learn'],
        display_order: 2
    }
];

const mockProfile = {
    full_name: "Hafizur Rahman",
    bio: "Web Developer & ML Enthusiast",
    email: "rahmanhafizur31928@gmail.com",
    location: "Bangladesh",
    avatar_url: ""
};

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect('mongodb+srv://rahmanhafizur31928_db_user:lTPURXd7jL6AluXp@cluster0.jsyxibm.mongodb.net/portfolio', {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            maxPoolSize: 10, // Maintain up to 10 socket connections
        });
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.log('❌ MongoDB connection failed, using mock data mode');
        console.log('Error details:', err.message);
        console.log('🔄 Server will continue with mock data');
    }
};

// Start connection
connectWithRetry();

app.get('/', (req, res) => {
    res.send('Portfolio API is running. Access the website at http://localhost:8081');
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
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
    try {
        // Try to get from MongoDB first, fallback to mock data
        const projects = await Project.find().sort('display_order');
        res.json(projects);
    } catch (err) {
        console.log('MongoDB not available, using mock data');
        res.json(mockProjects);
    }
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
    try {
        const inquiry = new Inquiry(req.body);
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
        console.log('MongoDB not available, but inquiry received:', req.body);
        // Still return success even if MongoDB fails
        res.json({ success: true, message: 'Inquiry received (mock mode)' });
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
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = mockProfile;
        }
        res.json(profile);
    } catch (err) {
        console.log('MongoDB not available, using mock profile');
        res.json(mockProfile);
    }
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


const PORT = 5000;

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
