import { Router } from "express";
import {
  signup,
  signin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
//   verifyResetToken,
    updatePassword,
  changePassword,
  signOut
} from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.middleware.js'
const authRouter = Router()

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.post('/verifymail/:token', verifyEmail)
authRouter.post('/resendverificationmail', resendVerificationEmail)
authRouter.post('/forgotpassword', forgotPassword);
// authRouter.post('/verifyresettoken/:token', verifyResetToken);
authRouter.patch('/updatepassword', updatePassword);
authRouter.patch('/changepassword',auth, changePassword);
authRouter.post('/signout',auth, signOut);

export default authRouter