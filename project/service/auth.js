const jwt = require("jsonwebtoken");
const secret = "muniba123455"; // Replace with a long, random, and secure key

function setUser(user) {
    // This function creates a JWT for a given user
    return jwt.sign({
        id: user._id,
        email: user.email,
    }, secret, { expiresIn: '1h' }); // Token expiration can be set as needed
}

function getUser(token) {
    // This function decodes a JWT and retrieves the user's information
    if (!token) return null;
    try {
        return jwt.verify(token, secret); // Verifies and returns the decoded token if valid
    } catch (error) {
        return null; // Returns null if token is invalid or expired
    }
}

module.exports = {
    setUser,
    getUser,
};