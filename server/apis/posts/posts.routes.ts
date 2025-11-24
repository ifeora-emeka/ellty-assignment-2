import { Router } from 'express';
import { createPost, getPosts, getPost, createReply } from './posts.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { createPostSchema, createReplySchema } from './posts.dto.js';

const postsRouter = Router();

postsRouter.post('/', requireAuth, validate(createPostSchema), createPost);
postsRouter.get('/', getPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/:id/reply', requireAuth, validate(createReplySchema), createReply);

export default postsRouter;
