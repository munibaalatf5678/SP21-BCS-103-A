const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');



const app = express();
const port = 3000

// Middleware for parsing the body of HTTP requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: '@muniba1234567', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Should be true if using https
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookApp2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// EJS View Engine Setup for rendering views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for serving static files like CSS, JavaScript, and images
app.use(express.static(path.join(__dirname, 'public')));

// Import routes

const booksRoutes = require('./routes/books');

// Use imported routes

app.use(booksRoutes);




// Catch-all for 404 errors
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});