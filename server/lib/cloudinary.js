const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImages",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chatFolder",
    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "pdf",
      "mp3",
      "mp4",
      "mkv",
      "docx",
      "xlsx",
      "pptx",
    ],
  },
});

const profileUpload = multer({ storage: profileStorage });
const chatUpload = multer({
  limits: { fileSize: 15 * 1024 * 1024 },
  storage: chatStorage,
});
module.exports = { profileUpload, chatUpload, cloudinary };
