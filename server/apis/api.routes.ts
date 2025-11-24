import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import postsRouter from './posts/posts.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/posts', postsRouter);

export default apiRouter;
