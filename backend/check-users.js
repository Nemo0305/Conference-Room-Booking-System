const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    uid: String,
    email: String,
    isVerified: Boolean,
    otp: String,
    otpExpires: Date,
    createdAt: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const unverifiedUsers = await User.find({ isVerified: false }).sort({ createdAt: -1 }).limit(20);
        console.log('\n--- UNVERIFIED USERS ---');
        unverifiedUsers.forEach(u => {
            console.log(`Email: ${u.email}, OTP: ${u.otp}, createdAt: ${u.createdAt}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkUsers();
