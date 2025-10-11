import { configDotenv } from 'dotenv';
import nodemailer from 'nodemailer';
configDotenv()



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false,
  port: 587,
});

export default transporter;
