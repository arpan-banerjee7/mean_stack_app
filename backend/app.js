const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const postRoutes = require("./routes/posts");
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
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api", postRoutes);
//ff
module.exports = app;
