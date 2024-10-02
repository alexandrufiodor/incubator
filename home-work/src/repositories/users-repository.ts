import { clientDB } from './db';
import { getPaginationWithFilter } from '../utils/utils';
import { ObjectId } from 'mongodb';
import { User } from './auth-repository';
import { PostType } from './posts-repository';

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
    console.log('🚀users-repository.ts:26', JSON.stringify(await usersCollection.find(filter).sort({ [`${sortBy}`]: sortDirection == 'desc' ? -1 : 1 }).limit(pagination.limit).skip(pagination.offset).toArray(), null, 2));
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
  async findUserByLoginOrEmail(loginOrEmail: string, hasConfirmed?: boolean): Promise<any> {
    const query = { $or: [ { 'accountData.login': loginOrEmail }, { 'accountData.email': loginOrEmail } ] };
    const user: any = await usersCollection.findOne(query);
    if (user){
      if (hasConfirmed) {
        return user;
      }
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
  async findUserByConfirmationCode(code: string): Promise<any> {
    const query = { 'emailConfirmation.confirmationCode': code }
    const user: any = await usersCollection.findOne(query);
    console.log('🚀users-repository.ts:60', JSON.stringify(user, null, 2));
    if (user){
      return {
        // @ts-ignore
        id: user?._id,
        ...user
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
  async updateUser(id: string, user: any): Promise<Array<PostType> | undefined | null> {
    console.log('🚀users-repository.ts:99', JSON.stringify(user, null, 2));
    const updatedUser: any = await usersCollection.updateOne({ _id: new ObjectId(id) }, { "$set": { ...user } })
    return updatedUser;
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
