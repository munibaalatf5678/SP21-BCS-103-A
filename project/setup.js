// setup.js

const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust the path as needed

async function setup() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/your-database-name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');

        // Create admin user
        const adminUser = new User({
            name: 'Muniba Altaf',
            email: 'munibaattaf123@gmail.com',
            password: '123456789',
            role: 'admin',
        });

        // Save the user to the database
        await adminUser.save();
        
        console.log('Admin user created and saved successfully');
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}

// Call the setup function
setup();
