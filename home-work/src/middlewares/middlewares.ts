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


export const authWithBarearTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    if (user) {
      //@ts-ignore
      req.user = {
        email: user.email,
        login: user.login,
        userId,
      };
      next()
      return
    }
  }
  res.sendStatus(401)
  // next();
  return
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = { login: 'admin', password: 'qwerty' }
  const b64auth = (req.headers.authorization || '').split('Basic ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.sendStatus(401);
}
