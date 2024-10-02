import { Router } from 'express';
import { emailServices } from '../domains/email-services';

export const email = Router();

email.post( '/send', async (req, res) => {
  await emailServices.sendEmailRecovery({email: req.body?.email, message: req.body?.message, subject: req.body?.subject })
  res.sendStatus(200)
})
