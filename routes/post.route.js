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

const postRouter = express.Router();


postRouter.get('/', getPosts);
postRouter.post('/', auth,createPost);
postRouter.get('/:id', getPostById);

postRouter.patch('/:id', auth, updatePost);

postRouter.delete('/:id', auth, deletePost);

postRouter.post('/:id/comments', auth, addComment);

export default postRouter;
