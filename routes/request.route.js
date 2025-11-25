import express from "express";
import { OAuth2Client } from 'google-auth-library';

import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
    
const requestRouter = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

requestRouter.post("/google", async (req, res, next) => {
     const { idToken } = req.body;
    try {
        
    if (!idToken) {
      return res.status(400).json({ message: 'No token provided' });
    }
          const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
          });
        
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;
        let user = await User.findOne({ googleId: sub });
              const { accessToken, refreshToken } = generateTokens(user._id);
       
        if (!user) {
          user = await User.create({ googleId: sub, email, username: name, avatar: picture, password: '123456789', refreshToken  });
        const { accessToken, refreshToken } = generateTokens(user._id);
      }
   
      user.refreshToken = refreshToken;
      user.isVerified = true;
      await user.save();

        res.status(200).json({message:"login sucessfull", userId: sub, email, name, accessToken, refreshToken });
    } catch (error) {
         console.log(error);
         next(error);
        
    }

});

export default requestRouter;
