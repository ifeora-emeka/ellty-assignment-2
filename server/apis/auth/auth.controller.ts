import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from '../../configs/passport.config.js';
import prisma from '../../configs/database.config.js';

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(201).json({ user });
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error | null, user: Express.User | false, info: { message?: string }) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ error: info?.message || 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            const { password: _password, ...userWithoutPassword } = user as Express.User;
            res.json({ user: userWithoutPassword });
        });
    })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};

export const me = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { password: _password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
};