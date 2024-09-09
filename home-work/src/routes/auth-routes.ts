import { Router } from 'express';
import { inputValidationMiddleware } from '../middlewares/middlewares';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';

export const authRoutes = Router();
export const loginValidation = body('loginOrEmail')
  .custom(async (value) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (!user) {
      return Promise.reject('User with that login does not exist');
    }
    return true
  })

authRoutes.post( '/login', loginValidation, inputValidationMiddleware, async (req, res) => {

  res.sendStatus(204)
})
