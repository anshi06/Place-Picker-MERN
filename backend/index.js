const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { ObjectId } = require("mongodb");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const MONGO_URL = process.env.MONGO_URI

const app = express();

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Server started and mongo connected!");
  })
  .catch((err) => {
    console.log(err);
  });

// Create a GridFS bucket instance
const conn = mongoose.connection;
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

app.use(bodyParser.json());

app.use("/images/:id", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const file = await gfs.files.findOne({ _id: id });

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/jpg"
    ) {
      // Set the Content-Type header based on the file's contentType
      res.setHeader("Content-Type", file.contentType);

      // Read output to browser
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      err: "Error retrieving file",
    });
  }
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello PlacePicker-server!");
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use(async (error, req, res, next) => {
  if (req.file.id) {
    await gridfsBucket.delete(new ObjectId(req.file.id));
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

module.exports = app;
