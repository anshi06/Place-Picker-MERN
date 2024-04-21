const multer = require("multer");
const uuid = require("uuidv1");
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.MONGO_URI

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      return {
        bucketName: "photos",
        filename: `${uuid() + "." + ext} `,
      };
    } else {
      return `${uuid() + "." + ext}`;
    }
  },
});

const fileUpload = multer({
  limits: 500000,
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
