import { clientDB } from './db';
import { getPaginationWithFilter } from '../utils/utils';
import { ObjectId } from 'mongodb';
import { User } from './auth-repository';

export type UserType = {
  id?: string,
  login: string,
  email: string,
  createdAt?: string,
}

export type UserDBType = {
  _id: string,
  login: string,
  email: string,
  createdAt?: string,
}

export const usersCollection = clientDB.collection<UserType | User>('users');

export const usersRepository = {
  async findAllUsers(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, filter ={}): Promise<any> {
    const pagination = await getPaginationWithFilter(pageNumber, pageSize, usersCollection, filter);
    //@ts-ignore
    const users: Array<User> = (await usersCollection.find(filter).sort({ [`${sortBy}`]: sortDirection == 'desc' ? -1 : 1 }).limit(pagination.limit).skip(pagination.offset).toArray())?.map((user: User) => {
      return {
        id: user._id,
        email: user?.accountData.email,
        login: user?.accountData.login,
        createdAt: user?.accountData.createdAt
      }
    });
    return {
      pagesCount: pagination.totalPages,
      page: pagination.page,
      pageSize: pagination.limit,
      totalCount: pagination.totalItems,
      items: users
    }
  },
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<any> {
    const query = { $or: [ { 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail } ] };
    const user: any = await usersCollection.findOne(query);
    if (user){
      return {
        // @ts-ignore
        id: user?._id,
        login: user?.accountData.login,
        email: user?.accountData.email,
        password: user.accountData.password
      };
    }
    return null
  },
  async findUserById(id: string): Promise<any> {
    const user: any = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (user){
      return {
        // @ts-ignore
        id: user?._id,
        login: user?.accountData.login,
        email: user?.accountData.email,
        password: user?.accountData.password
      };
    }
    return null
  },
  async createUser(user: any): Promise<any> {
    const newUser = await usersCollection.insertOne({
      ...user
    })
    return {
      id: newUser?.insertedId?.toString(),
      login: user?.accountData.login,
      email: user?.accountData.email,
      createdAt: user.accountData.createdAt
    };
  },
  async deleteUser(id: string) : Promise<boolean> {
    const deletedUser: any = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return deletedUser?.deletedCount === 1;
  },
  async deleteAllUsers(): Promise<boolean> {
    const deletedUsers: any = await usersCollection.deleteMany({});
    return deletedUsers?.acknowledged;
  }
}
