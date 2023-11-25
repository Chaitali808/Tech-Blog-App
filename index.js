const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongodbURL = process.env.MONGO_URL;

// const MONGO_URL = "mongodb+srv://chaitalibhavsar:Chaitali123@node.kwshqpy.mongodb.net/";

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("DB Connected Successfully!");
    })
    .catch((err) => {
        console.log("Error occurred at DB connection", err);
    });

const blogSchema = new mongoose.Schema({
    title: String,
    imageURL: String,
    description: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
    Blog.find({})
        .then((arr) => {
            res.render("index", { blogPostArray: arr });
        })
        .catch((err) => {
            console.log("Cannot Find Blogs", err);
            res.render("404");
        });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const image = req.body.imageUrl;
    const title = req.body.title;
    const description = req.body.description;

    const newBlog = new Blog({
        imageURL: image,
        title: title,
        description: description
    });

    newBlog.save()
        .then(() => {
            console.log("Blog Posted Successfully!");
            res.redirect("/");
        })
        .catch((err) => {
            console.log("Error posting New Blog", err);
            res.render("error");
        });
});

app.get("/post/:id", (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(post => {
            if (post) {
                res.render("post", { post: post });
            } else {
                res.render("404");
            }
        })
        .catch(err => {
            console.log("Error finding blog post", err);
            res.render("error");
        });
});


const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log("Server is listening on port 3000");
});
