import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { jwtService } from '../application/jwt-service';
import { usersServices } from '../domains/users-services';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errorsMessages: errors.array({ onlyFirstError: true }).map((error: any) => {
      return {
        message: error?.msg || 'Something went wrong',
        field: error?.path
      }
      })});
  }
  next()
}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.headers?.authorization) {
    res.sendStatus(401)
    next();
    return;
  }
    //@ts-ignore
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
      const user: any = await usersServices.findUserById(userId)
      //@ts-ignore
      req.user = {
        email: user.email,
        login: user.login,
        userId
      };
      next()
      return
    }
  res.sendStatus(401)
  next();
}
