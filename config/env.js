import { config } from 'dotenv';
config({ path: '.env' })

export const {
PORT,
 CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
} = process.env