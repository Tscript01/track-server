import { Server } from 'socket.io';
import Message from './models/message.model.js';
import Chat from './models/chat.model.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Connected:', socket.id);
    // Listen for new messages
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, content, sender, receiver } = data;
        console.log(data);
        
        if (!chatId || !content || !sender) {
          console.error('Missing required fields');
          return;
        }

        // Save message to MongoDB
        // const message = await Message.create({
        //   chatId: chatId, // make sure this matches your schema
        //   content,
        //   sender,
        //   receiver,
        // });

        // await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
        // console.log('Message saved:', message);

        io.to(chatId).emit('receiveMessage', content);
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

  console.log('Socket.IO initialized');
};
