const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const path = require("path");
var compression = require("compression");
var secure = require("ssl-express-www");

//configuration
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
//compress middleware to have faster loading
app.use(compression());
//use of this package for https encryption
app.use(secure);
//access the body of request
app.use(express.json({ extended: false }));

//deployment

if (process.env.NODE_ENV === "production") {
  app.use(express.static("front/build"));
  //send the react html if url not for api
  app.get("*", function (req, res, next) {
    res.setHeader("Accept-Encoding", "gzip, compress, br");
    let url = req.originalUrl;
    if (!url.startsWith("/api/")) {
      res.sendFile(path.resolve(__dirname, "front", "build", "index.html"));
      return;
    }
    next();
  });
}

//database connection
connectDB();

//routes
app.use("/api/action", require("./routes/actionRoute"));

//sever starter
const expressServer = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
