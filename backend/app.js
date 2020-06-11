const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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
  const post = req.body;
  console.log(post);

  res.status(200).json({
    message: "Posts added successfully!",
  });
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "gwgrew45234g2h",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "r2463y456573hu",
      title: "Seond server-side post",
      content: "This is second post coming from the server",
    },
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});
//ff
module.exports = app;
