import transporter from '../config/nodemailer.js';
import { generateEmailTemplate } from './mailtemplates.js';

export const sendPasswordResetEmail = async ({
  email,
  username,
  resetURL,
}) => {
  const htmlContent = generateEmailTemplate.passwordReset(username, resetURL);

  await transporter.sendMail({
    from: `"Slack" <miracleolaniyan60@gmail.com>`,
    to: email,
    subject: 'Password Reset Request',
    html: htmlContent,
  });
};

export const sendVerificationEmail = async ({
  email,
  firstName,
  verificationURL,
}) => {
  const htmlContent = generateEmailTemplate.emailVerification(
    firstName,
    verificationURL
  );

  await transporter.sendMail({
    from: `"Slack" <miracleolaniyan60@gmail.com>`,
    to: email,
    subject: 'Verify Your Email Address - Slack',
    html: htmlContent,
  });
};


