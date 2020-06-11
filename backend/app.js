const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Post = require("./models/post");
const mongoose = require("mongoose");

// mongoose
//   .connect(
//     "mongodb+srv://userArpan:passwordArpan@cluster0-3pvdp.mongodb.net/udemy-mean?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     console.log("Connected to mongi db");
//   })
//   .catch(() => {
//     console.log("Error connecting to mongi db");
//   });
const db =
  "mongodb+srv://userArpan:passwordArpan@cluster0-3pvdp.mongodb.net/udemy-angular?retryWrites=true&w=majority";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.post("/api/post", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((savedPost) => {
    res.status(200).json({
      id: savedPost._id,
      message: "Posts added successfully!",
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  });
});
//ff
module.exports = app;
