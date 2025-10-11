import express from 'express';
import auth from '../middlewares/auth.middleware.js'
import { getOrCreateChat } from '../controllers/chat.controller.js'

const chatRouter = express.Router();
chatRouter.post('/', auth, getOrCreateChat);

export default chatRouter;
