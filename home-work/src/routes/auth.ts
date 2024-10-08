import { Router } from 'express';
import { authServices } from '../domains/auth-services';
import { jwtSecret, jwtService } from '../application/jwt-service';
import { authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { emailValidation, loginValidation, passwordValidation } from './users';
import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';
//@ts-ignore
import jwt from 'jsonwebtoken';

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

const verifyRefreshToken = (req: any, res: any, next: any) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const verified = jwt.verify(refreshToken, jwtSecret as string);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

auth.post( '/login', async (req, res) => {
  const user = await authServices.authUser(req.body?.loginOrEmail, req.body?.password)
  if (!user || !req.body?.loginOrEmail || !req.body?.password) {
    res.sendStatus(401)
    return;
  }
  const token = await jwtService.createJWT(user)
  const refreshToken = await jwtService.createJWT(user, '20s')
  res.status(200).cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true }).send({
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


auth.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, jwtSecret, (err: any, user: any) => {
    if (err || Date.now() >= user.exp * 1000 || !user) {
      res.clearCookie('refreshToken');
      return res.sendStatus(401);
    }
    const newAccessToken = jwt.sign({ userId: user.userId }, jwtSecret, { expiresIn: '10s' });
    // const newRefreshToken = jwt.sign({ userId: user.userId }, jwtSecret, { expiresIn: '20s' });
    // res.cookie('refreshToken', newRefreshToken, { httpOnly: true,  secure: true });
    res
      .status(200)
      .send({ accessToken: newAccessToken });
  });
});

auth.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.clearCookie('refreshToken', { httpOnly: true });
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, jwtSecret, (err: any, user: any) => {
    res.clearCookie('refreshToken', { httpOnly: true });
    if (err || Date.now() >= user.exp * 1000 || !user) {
      return res.sendStatus(401);
    }
    return res.sendStatus(204);
  });
});
