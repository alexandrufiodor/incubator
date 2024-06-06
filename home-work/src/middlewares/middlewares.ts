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


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = { login: 'admin', password: 'qwerty' }
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.sendStatus(401);
}
