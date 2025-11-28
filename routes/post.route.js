import express from 'express';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
} from '../controllers/post.controller.js';
import auth from '../middlewares/auth.middleware.js';
import { checkPostLimit } from '../middlewares/post.middleware.js';
import multer from 'multer';

const postRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = [
  //     "image/jpeg",
  //     "image/png",
  //     "image/gif",
  //     "image/webp",
  //   //   "application/pdf",
  //   //   "application/msword",
  //   //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   //   "text/plain",
  //   //   "application/zip",
  //   ];

  //   if (allowedTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("File type not allowed"), false);
  //   }
  // },
});

postRouter.get('/', getPosts);
postRouter.post('/', auth, 
                checkPostLimit,
                 upload.array("posts", 5),
                createPost);
postRouter.get('/:id', getPostById);

postRouter.patch('/:id', auth, updatePost);

postRouter.delete('/:id', auth, deletePost);

postRouter.post('/:id/comments', auth, addComment);

export default postRouter;
