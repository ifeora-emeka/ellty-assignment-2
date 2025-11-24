import { Router } from 'express';
import { signup, login, logout, me } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { requireAuth } from './auth.middleware.js';
import { signupSchema, loginSchema } from './auth.dto.js';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), signup);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, me);

export default authRouter;