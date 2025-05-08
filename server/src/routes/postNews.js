import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import NewsData from "../models/News.js";
import authenticateToken from "../middlewares/authUser.js";
import Joi from "joi";

dotenv.config();

const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});


cloudinary.config({
  cloud_name: "dlwdhadk2",
  api_key: apiKey,
  api_secret: apiSecret,
});


async function uploadFiles(fileBuffer, type) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "images",
        public_id: `${type}_${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}


const postSchema = Joi.object({
  Description: Joi.string().min(5).max(1000).required(),
  article: Joi.string().min(10).required(),
  userRoll: Joi.string().required(),
  categories: Joi.string()
    .custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error();
        return value;
      } catch (err) {
        return helpers.message("Categories must be a valid JSON array string.");
      }
    })
    .required(),
});

// Route to post news
router.post(
  "/",
  upload.fields([{ name: "thumbnail" }, { name: "images" }]),
  authenticateToken,
  async (req, res) => {
    try {
      // Validate input
      const { error } = postSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const { Description, article, userRoll, categories } = req.body;

      const parsedCategories = JSON.parse(categories).map((tag) => ({
        Tags: tag,
      }));

      const thumbnail = req.files["thumbnail"]?.[0] || null;
      const images = req.files["images"] || [];

      let thumbnailUrl = "";
      let imageUrls = [];

      if (thumbnail) {
        thumbnailUrl = await uploadFiles(thumbnail.buffer, "thumbnail");
      }

      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map((item) => uploadFiles(item.buffer, "images"))
        );
      }

      const newNews = new NewsData({
        Description,
        Article: article,
        Category: parsedCategories,
        Thumbnail: thumbnailUrl,
        Images: imageUrls.map((url) => ({ url })),
        Date: Date.now(),
        EditorId: userRoll,
      });

      await newNews.save();

      res.status(200).json({
        message: "Files uploaded successfully",
        thumbnailUrl,
        imageUrls,
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).send("Error uploading files");
    }
  }
);

export default router;
