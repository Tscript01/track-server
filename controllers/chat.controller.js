import Chat from '../models/chat.model.js';

export const getOrCreateChat = async (req, res) => {
  const { recipientId } = req.body;
  if (!recipientId)
    return res.status(400).json({ message: 'Recipient required' });

  let chat = await Chat.findOne({
    users: { $all: [req.user._id, recipientId] },
  }).populate('users', '-password');

  if (!chat) {
    chat = await Chat.create({ users: [req.user._id, recipientId] });
    chat = await chat.populate('users', '-password');
  }

  res.status(200).json(chat);
};
