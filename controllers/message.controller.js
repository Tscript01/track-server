import Message from '../models/message.model.js';
import Chat from '../models/chat.model.js';

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content)
    return res.status(400).json({ message: 'Invalid data' });

  const message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
  res.status(201).json(await message.populate('sender', 'username email'));
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate('sender', 'username email')
    .sort({ createdAt: 1 });
  res.json(messages);
};
