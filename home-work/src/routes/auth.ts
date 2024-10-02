import { Router } from 'express';
import { authServices } from '../domains/auth-services';
import { jwtService } from '../application/jwt-service';
import { authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { emailValidation, loginValidation, passwordValidation } from './users';

export const auth = Router();

auth.post( '/login', async (req, res) => {
  const user = await authServices.authUser(req.body?.loginOrEmail, req.body?.password)
  if (!user || !req.body?.loginOrEmail || !req.body?.password) {
    res.sendStatus(401)
    return;
  }
  const token = await jwtService.createJWT(user)
  res.status(200).send({
    accessToken: token
  });
})

auth.get( '/me', authWithBarearTokenMiddleware, async (req: any, res: any) => {
  if (req?.user) {
    res.status(200).send(req?.user);
    return;
  }
  res.sendStatus(401)
  return
})

auth.post( '/registration', loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, async (req, res) => {
  await authServices.createUser(req.body?.login, req.body?.email, req.body?.password)
  res.sendStatus(204);
  return;
})
