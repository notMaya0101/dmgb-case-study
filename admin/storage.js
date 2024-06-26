const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
//const crypto = require("crypto");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads",
      mimetype: file.mimetype,
    };
  },
});

//const storage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    console.log(file);
//    return {
//      filename: file.originalname,
//      bucketName: "GridFS",
//      mimetype: file.mimetype,
//    };
//  },
//});

const allowedMimeTypes = [
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/pdf", // .pdf
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .doc, .docx, and .pdf files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter }).array("files", 200); // allow 200 files if files inside folder contains multiple files

// WILL USE IF THE NEED TO HASH THE FILENAME ARISES
//const folderStorage = new GridFsStorage({
//  url: process.env.MONGO_URI,
//  file: (req, file) => {
//    return new Promise((resolve, reject) => {
//      crypto.randomBytes(16, (err, buf) => {
//        if (err) {
//          console.error("Error generating random bytes:", err);
//          return reject(err);
//        }
//        const filename = buf.toString("hex") + path.extname(file.originalname);
//        const fileInfo = {
//          filename: filename,
//          bucketName: "uploads",
//        };
//        resolve(fileInfo);
//      });
//    });
//  },
//});

module.exports = upload;
