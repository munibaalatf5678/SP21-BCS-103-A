const User = require('../models/user');
const { setUser } = require('../service/auth');

const handleUserSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        console.log("User created successfully");
        res.redirect("/login");
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
};

// In controllers/users.js

const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // In production, use hashed passwords
        if (!user) {
            return res.render("login", { error: "Invalid username or password" });
        }

        // Token-based
        const token = setUser(user);
        res.cookie("uid", token, { httpOnly: true, path: '/' });
        console.log("Token-based authentication done");

        // Session-based
        req.session.userId = user._id; // Set user ID in session
        console.log("Session-based authentication done");

        // Redirect to /blogPage after successful login
        res.redirect("/blogPage");

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("Error logging in user");
    }
};

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
