const { getUser } = require('../service/auth');

async function restrictToLoggedinUserOnly(req, res, next) {
    // Continue if the user has a valid session or if the JWT token is valid
    if (req.session.userId) {
        return next(); // Session is valid
    }

    const token = req.cookies.uid;
    const user = await getUser(token);
    if (token && user) {
        req.user = user;
        return next(); // Token is valid
    }

    return res.redirect('/login'); // No valid session or token, redirect to login
}

module.exports = {
    restrictToLoggedinUserOnly,
};