import { z } from 'zod';

export const createPostSchema = z.object({
    value: z.number().finite(),
});

export const createReplySchema = z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    operand: z.number().finite(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type CreateReplyDto = z.infer<typeof createReplySchema>;
