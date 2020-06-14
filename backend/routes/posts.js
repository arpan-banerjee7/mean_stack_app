const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/post", (req, res, next) => {
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

router.get("/posts", (req, res, next) => {
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

router.get("/post/:id", (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((document) => {
      res.status(200).json({
        message: `Post with id : ${document._id} fetched successfully!`,
        post: document,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: `Post with id : ${document._id} not found!`,
      });
    });
});

router.put("/put", (req, res, next) => {
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  console.log(`The updated post is : ${updatedPost}`);
  Post.updateOne({ _id: req.body.id }, updatedPost)
    .then((document) => {
      console.log(document);
      res.status(200).json({
        message: "Post updated successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/posts/:id", (req, res, next) => {
  console.log(req.params);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

module.exports = router;
