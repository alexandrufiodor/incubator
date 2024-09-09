import { Router } from 'express';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';
import { authServices } from '../domains/auth-services';

export const authRoutes = Router();
export const loginValidation = body('loginOrEmail')
  .custom(async (value) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (!user) {
      return Promise.reject('User with that login or email does not exist');
    }
    return true
  })

authRoutes.post( '/login', async (req, res) => {
  const user = await authServices.authUser(req.body?.loginOrEmail, req.body?.password)
  if (!user || !req.body?.loginOrEmail || !req.body?.password) {
    res.sendStatus(401)
    return;
  }
  res.sendStatus(204)
})
