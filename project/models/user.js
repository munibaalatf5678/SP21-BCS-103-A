const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // Default role is 'user', modify as needed
}, { timestamps: true });

// Create the model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
