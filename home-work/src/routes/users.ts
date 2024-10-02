import { Router } from 'express';
import { usersServices } from '../domains/users-services';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';


export const users = Router();

export const loginValidation = body('login')
  .notEmpty()
  .withMessage('Login field is required.')
  .isString()
  .trim()
  .isLength({min: 3, max: 10 })
  .withMessage('Login length should be from 3 to 10 symbols')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Invalid login format').custom(async (value) => {
    console.log('🚀users.ts:19', JSON.stringify(value, null, 2));
    const user = await usersRepository.findUserByLoginOrEmail(value);
    console.log('🚀users.ts:20', JSON.stringify(user, null, 2));
    if (user) {
      return Promise.reject('Login must be unique');
    }
    return true
  })

export const emailValidation = body('email')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email format').custom(async (value) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (user) {
      return Promise.reject('Email must be unique');
    }
    return true
  })

export const passwordValidation = body('password')
  .notEmpty()
  .withMessage('Password field is required.')
  .isString()
  .trim()
  .isLength({min: 6, max: 20 })
  .withMessage('Password length should be from 6 to 20 symbols');

users.get( '/', authMiddleware, async (req, res) => {
  res.send(await usersServices.findAllUsers(req?.query?.pageSize?.toString() || '10', req?.query?.pageNumber?.toString() || '1', req?.query?.sortBy?.toString() || 'createdAt', req?.query?.sortDirection?.toString() || 'desc', req?.query?.searchEmailTerm?.toString() || '', req?.query?.searchLoginTerm?.toString() || ''))
})
users.post( '/', authMiddleware, loginValidation, emailValidation, passwordValidation, inputValidationMiddleware, async (req, res) => {
  res.status(201).send(await usersServices.createUser(req.body?.login, req.body?.email, req.body?.password));
})
users.delete( '/:id', authMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const deletedUser = await usersServices.deleteUser(req.params.id?.toString());
  if (deletedUser) {
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404);
})
