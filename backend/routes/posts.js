const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    console.log(file.mimetype);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/post",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    console.log(post.imagePath);
    post.save().then((createdPost) => {
      //createdPost.toObject();
      console.log('original "createdPost":', createdPost);
      res.status(200).json({
        message: "Posts added successfully!",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
      // console.log("post without spread:", {
      //   id: createdPost._id,
      //   title: createdPost.title,
      //   content: createdPost.content,
      //   imagePath: createdPost.imagePath,
      // });

      // console.log("post with spread:", {
      //   ...createdPost,
      //   id: createdPost._id,
      // });
    });
  }
);

router.get("/posts", (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        maxPosts: count,
        posts: fetchedPosts,
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

router.put(
  "/put",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const updatedPost = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
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
  }
);

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
