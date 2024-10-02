import { authRepository, User } from '../repositories/auth-repository';
import { encryptionPassword } from '../utils/utils';
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import { add } from 'date-fns';
import { emailManagers } from '../managers/email-managers';

const htmlTemplate = (code: string) => {
  return `<h1>Thank for your registration</h1>
  <p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>
`
}

export const authServices = {
  async authUser(loginOrEmail: string, password: string): Promise<boolean> {
    return await authRepository.findUserByLoginOrEmail(loginOrEmail,
      password);
  },
  async createUser(login: string, email: string, password: string): Promise<User | null> {
    const createdAt =  new Date().toISOString();
    const newPassword = await encryptionPassword(password)
    const user = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        passwordHash: newPassword,
        createdAt,
      },
     emailConfirmation: {
        confirmationCode: uuidv4(),
       expirationDate: add(new Date(), {
         minutes: 3
       }),
       isConfirmed: false
     }
    }
    const createResult = await authRepository.createUser(user);
    await emailManagers.sendEmailConfirmationMessage({ email, subject: 'Test', message: htmlTemplate(user?.emailConfirmation?.confirmationCode) })
    return createResult
  },
}
