import { PostType } from '../repositories/posts-repository';
import { usersRepository, UserType } from '../repositories/users-repository';
import { verifyId } from '../utils/utils';

export const usersServices = {
  async findAllUsers(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, searchEmailTerm: string, searchLoginTerm: string): Promise<Array<PostType>> {
    return await usersRepository.findAllUsers(pageSize, pageNumber, sortBy, sortDirection, {
      $or: [
        { login: { $regex: new RegExp(searchLoginTerm, 'i') } },
        { email: { $regex: new RegExp(searchEmailTerm, 'i') } }
    ]
    });
  },
  async createUser(login: string, email: string, password: string): Promise<UserType> {
    const createdAt =  new Date().toISOString();
    const user = {
      login,
      email,
      password,
      createdAt,
    }
    return await usersRepository.createUser(user);
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
