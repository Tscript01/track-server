import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    req.user = user;
    
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({
      message: 'Unauthorized',
      error: error.message,
    });
  }
};

export default auth;
