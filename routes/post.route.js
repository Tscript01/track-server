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

const postRouter = express.Router();


postRouter.get('/', getPosts);
postRouter.post('/', auth, checkPostLimit, createPost);
postRouter.get('/:id', getPostById);

postRouter.patch('/:id', auth, updatePost);

postRouter.delete('/:id', auth, deletePost);

postRouter.post('/:id/comments', auth, addComment);

export default postRouter;
