require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");
var bodyParser = require("body-parser");
// const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
// const cloudinary = require("./cloudinary/cloudinary");

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_ACCESS, () =>
  console.log("Database connected")
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(cors());
app.use(express.static(path.join(__dirname + "/public")));

app.use("/api/users", userRoutes);
// app.use(errorHandler);

// app.get("*", (req, res, next) => {
//   res.sendFile(path.join(__dirname + "/public/index.html"));
// });
// app.use(notFound);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
