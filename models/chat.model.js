import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);


const Chat = mongoose.model('chats', chatSchema);
export default Chat;
