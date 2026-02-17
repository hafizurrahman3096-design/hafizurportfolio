const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
    await mongoose.connect('mongodb://localhost:27017/portfolio');
    const AdminSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    });
    const Admin = mongoose.model('Admin', AdminSchema);

    await Admin.deleteMany({});

    const hashedPassword = await bcrypt.hash('Rahman@443', 10);
    const newAdmin = new Admin({
        username: 'hafi',
        password: hashedPassword
    });

    await newAdmin.save();
    console.log('Admin user updated successfully');
    process.exit();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
