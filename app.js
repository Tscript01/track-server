import { configDotenv } from 'dotenv'
import express from 'express'
import http from 'node:http'
import ajMiddleware from './middlewares/arcjet.middleware.js'
import cors from 'cors';
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'
import paymentRouter from './routes/payment.route.js'
import errorMiddleware from './middlewares/error.middleware.js'
import requestRouter from './routes/request.route.js';
import { initSocket } from './socket.js'

configDotenv()
const app = express()
const PORT = process.env.PORT
const server = http.createServer(app);

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Session-Id',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
// app.use(ajMiddleware)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to slack API',
  });
});
app.use('/api/auth', authRouter) 
app.use('/api/post', postRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/request', requestRouter);




app.use('', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware)
export default app;