import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

 const Message = mongoose.model('Message', messageSchema);
export default Message