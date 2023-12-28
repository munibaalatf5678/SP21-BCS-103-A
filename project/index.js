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
const userRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');

// Use imported routes
app.use(userRoutes);
app.use(booksRoutes);

// GET route for serving the signup page
app.get('/signup', (req, res) => {
    res.render('signUp');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});


// GET route for serving the login page
app.get('/login', (req, res) => {
    res.render('login');
});


// Middleware function to check if the user is logged in
// Middleware function to check if the user is logged in
const restrictToLoggedinUserOnly = (req, res, next) => {
    if (req.session.userId || req.cookies.uid) {
        next();
    } else {
        res.redirect('/login');
    }
};
app.get('/calculator', (req, res) => {
    res.render('calculator', { history: req.session.history || [] });
});
app.post('/calculate', (req, res) => {
    const operand1 = parseFloat(req.body.operand1);
    const operand2 = parseFloat(req.body.operand2);
    const operation = req.body.operation;
    let result;

    switch (operation) {
        case '+': result = operand1 + operand2; break;
        case '-': result = operand1 - operand2; break;
        case '*': result = operand1 * operand2; break;
        case '/': result = operand2 !== 0 ? operand1 / operand2 : 'Infinity'; break;
        default: result = 'Invalid operation'; break;
    }

    if (!req.session.history) {
        req.session.history = [];
    }

    req.session.history.push({
        operand1: operand1,
        operation: operation,
        operand2: operand2,
        result: result
    });

    res.redirect('/calculator');
});

// Use restrictToLoggedinUserOnly middleware before the /blogPage route
app.get('/blogPage', restrictToLoggedinUserOnly, (req, res) => {
    res.render('blogPage');
});

app.get('/home-route', (req, res) => {
    const message = {
        type: 'success',
        message: 'This is a success message.'
    };
    res.render('home', { message });
});
app.get('/logout1', (req, res) => {
    res.render('logout1');
});

// Route for handling the logout action
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

// Catch-all for 404 errors
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});