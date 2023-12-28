// booksMiddleware.js
const booksModel = require('../models/books');

const validateBookLimit = async (req, res, next) => {
    try {
        const bookCount = await booksModel.countDocuments();
        const bookLimit = 50;

        if (bookCount >= bookLimit) {
            return res.json({ message: `Cannot add more than ${bookLimit} books.`, type: 'danger' });
        }

        next();
    } catch (error) {
        res.json({ message: error.message, type: 'danger' });
    }
};

const validateBookForm = (req, res, next) => {
    const { name, author_name, email } = req.body;

    if (!name || !author_name || !email) {
        return res.json({ message: 'All fields are required', type: 'danger' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ message: 'Invalid email format', type: 'danger' });
    }

    next();
};

module.exports = { validateBookLimit, validateBookForm };
