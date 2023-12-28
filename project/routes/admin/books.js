const express = require('express');
const router = express.Router();
const booksModel = require('../models/books');  // Use a different variable name (e.g., booksModel) for the model
const multer = require('multer');
const fs=require("fs")

// Multer configuration for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Make sure this directory exists or multer will throw an error
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

// Multer Upload Middleware
var upload = multer({ storage: storage }).single('image');

router.post("/add", upload, async (req, res) => {
    try {
        const newBook = new booksModel({
            name: req.body.name,
            author_name: req.body.author_name,
            email: req.body.email,
            image: req.file ? req.file.filename : '' // Handle if the file is not uploaded
        });

        await newBook.save();
        
        req.session.message = {
            type: 'success',
            message: 'Book added successfully'
        };
        res.redirect('/home');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

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
    res.render("add_users");
});

//edit the book
router.get("/edit/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const book = await booksModel.findById(id).exec();

        if (!book) {
            return res.redirect('/home');
        }

        res.render('edit_books', { book: book }); // Pass the book to the view
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

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

        // Using async/await for better readability
        const result = await booksModel.findByIdAndUpdate(id, {
            name: req.body.name,
            author_name: req.body.author_name,
            email: req.body.email,
            image: new_image
        });

        if (!result) {
            return res.json({ message: "Book not found", type: "danger" });
        }

        req.session.message = {
            type: "success",
            message: "Book updated successfully"
        };
        res.redirect("/home");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});
//delette user route

// Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;

        // Use findOneAndDelete() instead of findByIdAndRemove()
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

        req.session.message = {
            type: 'info',
            message: 'Book deleted successfully'
        };
        res.redirect('/home');
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

module.exports = router;

