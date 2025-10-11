import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';

const messageRouter = express.Router();
messageRouter.post('/', auth, sendMessage);
messageRouter.get('/:chatId', auth, getMessages);

export default messageRouter;
