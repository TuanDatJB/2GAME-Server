const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: (req, file) => {
    let folder = "2GAME";
    return {
      folder,
      resource_type: "auto",
    };
  },
});

const uploadCloud = multer({ storage }).array("images");
const uploadCloudAvatar = multer({ storage }).array("avatar");

module.exports = { uploadCloud, uploadCloudAvatar };
