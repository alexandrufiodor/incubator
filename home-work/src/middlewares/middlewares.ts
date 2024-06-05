import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errorsMessages: errors.array().map((error: any) => {
      return {
        message: error?.msg || 'Something went wrong',
        field: error?.path
      }
      })});
  }
  next()
}
