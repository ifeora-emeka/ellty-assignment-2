import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          errors: error.issues,
        });
      } else {
        res.status(400).json({
          error: 'Validation failed',
          errors: [{ message: 'Unknown error' }],
        });
      }
    }
  };
};
