// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";
// import multer from "multer";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./env.js";


cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
// console.log(cloudinary);



// Storage configuration for demo videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "course-demo-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1280, height: 720, crop: "limit" },
    ],
  },
});




// Multer configuration for videos
// export const uploadVideo = multer({
//   storage: videoStorage,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // 100MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "video/mp4",
//       "video/avi",
//       "video/mov",
//       "video/wmv",
//       "video/quicktime",
//       "video/webm",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only video files are allowed."), false);
//     }
//   },
// });



// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: "auto",
      folder: options.folder || "trackposts",
      quality: "auto",
      fetch_format: "auto",
      ...options,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
