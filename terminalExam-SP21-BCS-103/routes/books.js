
const express = require('express');
const router = express.Router();
const booksModel = require('../models/books');
const multer = require('multer');
const fs = require('fs');
const { validateBookLimit, validateBookForm } = require('../middlewares/booksMiddleware');

// Multer configuration for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

// Multer Upload Middleware
var upload = multer({ storage: storage }).single('image');

// Route to render the form for adding a new book
router.get("/add", (req, res) => {
    res.render("add_books");
});

// Route to handle adding a new book
router.post("/add", upload, validateBookLimit, validateBookForm, async (req, res) => {
    try {
        const newBook = new booksModel({
            name: req.body.name,
            author_name: req.body.author_name,
            email: req.body.email,
            image: req.file ? req.file.filename : ''
        });

        await newBook.save();

     
        res.redirect('/home');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Route to render the home page with all books
router.get("/home", async (req, res) => {
    try {
        const allBooks = await booksModel.find().exec();

        res.render("home", {
            books: allBooks,
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});
router.get("/add", (req, res) => {
    res.render("add_books");
});


// Route to render the form for editing a book
router.get("/edit/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const book = await booksModel.findById(id).exec();

        if (!book) {
            return res.redirect('/home');
        }

        res.render('edit_books', { book: book });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Route to handle updating a book
router.post("/update/:id", upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        const result = await booksModel.findByIdAndUpdate(id, {
            name: req.body.name,
            author_name: req.body.author_name,
            email: req.body.email,
            image: new_image
        });

        if (!result) {
            return res.json({ message: "Book not found", type: "danger" });
        }

    
        res.redirect("/home");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Route to handle deleting a book
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const result = await booksModel.findOneAndDelete({ _id: id });

        if (result && result.image) {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (error) {
                console.log(error);
            }
        }

        if (!result) {
            return res.json({ message: "Book not found", type: "danger" });
        }

     
      
        res.redirect('/home');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

module.exports = router;
