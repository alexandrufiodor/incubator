import { usersRepository } from './users-repository';
import { comparePassword } from '../utils/utils';
import { ObjectId } from 'mongodb';
interface AccountData {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface User {
  _id: ObjectId;
  accountData: AccountData;
  emailConfirmation: EmailConfirmation;
}

export const authRepository = {
  async findUserByLoginOrEmail(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return false;
    }
    if (await comparePassword( password, user.password)) {
      return user;
    }
    return false
  },
  async createUser(user: User): Promise<User | null> {
    const newUser = await usersRepository.createUser(user);
    if (!newUser) {
      return null
    }
    return user
  },
}


