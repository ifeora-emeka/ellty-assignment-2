import { Request, Response } from 'express';
import prisma from '../../configs/database.config.js';

const calculateResult = (parentValue: number, operation: string, operand: number): number => {
    switch (operation) {
        case 'add':
            return parentValue + operand;
        case 'subtract':
            return parentValue - operand;
        case 'multiply':
            return parentValue * operand;
        case 'divide':
            if (operand === 0) throw new Error('Division by zero');
            return parentValue / operand;
        default:
            throw new Error('Invalid operation');
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { value } = req.body;

        const post = await prisma.post.create({
            data: {
                value,
                userId: req.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        res.status(201).json({ post });
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        const posts = await prisma.post.findMany({
            where: {
                parentId: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                operation: true,
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        res.json({ posts });
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                operation: true,
                parent: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                        operation: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                        operation: true,
                        _count: {
                            select: {
                                replies: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createReply = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const { operation, operand } = req.body;

        const parentPost = await prisma.post.findUnique({
            where: { id },
        });

        if (!parentPost) {
            return res.status(404).json({ error: 'Parent post not found' });
        }

        const calculatedValue = calculateResult(parentPost.value, operation, operand);

        const reply = await prisma.post.create({
            data: {
                value: calculatedValue,
                userId: req.user.id,
                parentId: id,
                operation: {
                    create: {
                        type: operation,
                        operand,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                operation: true,
                parent: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json({ post: reply });
    } catch (error) {
        if (error instanceof Error && error.message === 'Division by zero') {
            return res.status(400).json({ error: 'Division by zero is not allowed' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
