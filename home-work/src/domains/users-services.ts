import { usersRepository, UserType } from '../repositories/users-repository';
import { encryptionPassword, verifyId } from '../utils/utils';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export const usersServices = {
  async findAllUsers(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, searchEmailTerm: string, searchLoginTerm: string): Promise<Array<UserType>> {
    return await usersRepository.findAllUsers(pageSize, pageNumber, sortBy, sortDirection, {
      $or: [
        { 'accountData.login': { $regex: new RegExp(searchLoginTerm, 'i') }},
        { 'accountData.email': { $regex: new RegExp(searchEmailTerm, 'i') }}
    ]
    });
  },
  async findUserById(userId: string): Promise<Array<UserType>> {
    return await usersRepository.findUserById(userId);
  },
  async createUser(login: string, email: string, password: string): Promise<UserType> {
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
        isConfirmed: true
      }
    }
    return await usersRepository.createUser(user);
  },
  async updateUserByCode(code: string): Promise<any> {
    if (code) {
      const findUser = await usersRepository.findUserByConfirmationCode(code);
      if (findUser) {
        const updatedUser: any =  await usersRepository.updateUser(findUser?.id, { ...findUser, emailConfirmation: { isConfirmed: true } });
        return updatedUser;
      }
    }
    return null;
  },
  async updateUserByEmail(email: string): Promise<any> {
    if (email) {
      const findUser = await usersRepository.findUserByLoginOrEmail(email, true);
      const confirmationCode = uuidv4();
      if (findUser) {
        await usersRepository.updateUser(findUser?._id, {
          ...findUser,
          emailConfirmation: {
            isConfirmed: false,
            confirmationCode,
            expirationDate: add(new Date(), {
              minutes: 3
            }),
          }
        });
        return confirmationCode;
      }
    }
    return null;
  },
  async deleteUser(id: string): Promise<boolean> {
    if (verifyId(id)) {
      return await usersRepository.deleteUser(id);
    }
    return false;
  },
  async deleteAllUsers(): Promise<boolean> {
    return await usersRepository.deleteAllUsers();
  }
}
