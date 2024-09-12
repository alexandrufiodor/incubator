import { Router } from 'express';
import { authServices } from '../domains/auth-services';
import { jwtService } from '../application/jwt-service';
import { authMiddleware } from '../middlewares/middlewares';

export const authRoutes = Router();

authRoutes.post( '/login', async (req, res) => {
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

authRoutes.get( '/me', authMiddleware, async (req: any, res: any) => {
  if (req?.user) {
    res.status(200).send(req?.user);
    return;
  }
  res.sendStatus(401)
  return
})
