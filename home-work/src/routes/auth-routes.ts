import { Router } from 'express';
import { inputValidationMiddleware } from '../middlewares/middlewares';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';
import { comparePassword } from '../utils/utils';

export const authRoutes = Router();
export const loginValidation = body('login')
  .custom(async (value) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (!user) {
      return Promise.reject('User with that login does not exist');
    }
    return true
  })

authRoutes.post( '/', loginValidation, inputValidationMiddleware, async (req, res) => {
  
  res.sendStatus(204)
})
