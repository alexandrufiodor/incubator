import { Router } from 'express';
import { authServices } from '../domains/auth-services';
import { jwtService } from '../application/jwt-service';
import { authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { emailValidation, loginValidation, passwordValidation } from './users';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';

export const codeValidation = body('code')
  .notEmpty()
  .withMessage('Code field is required.')
  .isString().withMessage('Invalid code')
  .custom(async (value) => {
    const user = await usersRepository.findUserByConfirmationCode(value);
    if (!user) {
      return Promise.reject('Invalid code');
    }
    return true
  })

export const emailRegistrationValidation = body('email')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email format').custom(async (value) => {
    const user = await usersRepository.findUserByLoginOrEmail(value, true);
    if (!user) {
      return Promise.reject('User email doesnt exist');
    }
    if (user?.emailConfirmation?.isConfirmed) {
      return Promise.reject('Email is confirmed!');
    }
    return true
  })


export const auth = Router();

auth.post( '/login', async (req, res) => {
  const user = await authServices.authUser(req.body?.loginOrEmail, req.body?.password)
  if (!user || !req.body?.loginOrEmail || !req.body?.password) {
    res.sendStatus(401)
    return;
  }
  const token = await jwtService.createJWT(user)
  const refreshToken = await jwtService.createJWT(user, '20s')
  res.status(200).cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 20 * 1000 }).send({
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

auth.post( '/registration-confirmation', codeValidation, inputValidationMiddleware, async (req, res) => {
  const registrationCode  = await authServices.registrationCode(req.body?.code)
  if (registrationCode) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(400)
  }
})

auth.post( '/registration-email-resending', emailRegistrationValidation, inputValidationMiddleware, async (req, res) => {
  await authServices.registrationEmailResending(req.body?.email)
  res.sendStatus(204);
  return;
})


auth.post('/refresh-token', authWithBarearTokenMiddleware, (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401);
  }
  try {
    const decoded = jwtService.getUserIdByToken(refreshToken);
    const newRefreshToken = jwtService.createJWT({ id: decoded }, '20s');
    const accessToken = jwtService.createJWT({ id: decoded });

    res
      .status(200)
      .cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 20 * 1000 })
      .send({accessToken});
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
  res.sendStatus(401)
  return
});

auth.post('/logout', authWithBarearTokenMiddleware, (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401);
  }
  try {
    res.clearCookie('refreshToken');
    res.sendStatus(204)
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
  res.sendStatus(401)
  return
});
