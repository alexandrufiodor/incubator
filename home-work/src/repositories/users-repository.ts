import { clientDB } from './db';
import { getPaginationWithFilter } from '../utils/utils';
import { ObjectId } from 'mongodb';

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

export const usersCollection = clientDB.collection<UserType>('users');

export const usersRepository = {
  async findAllUsers(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, filter ={}): Promise<any> {
    const pagination = await getPaginationWithFilter(pageNumber, pageSize, usersCollection, filter);
    //@ts-ignore
    const posts: Array<UserType> = (await usersCollection.find(filter).sort({ [`${sortBy}`]: sortDirection == 'desc' ? -1 : 1 }).limit(pagination.limit).skip(pagination.offset).toArray())?.map((post: UserDBType) => {
      return {
        id: post._id,
        email: post.email,
        login: post.login,
        createdAt: post.createdAt
      }
    });
    return {
      pagesCount: pagination.totalPages,
      page: pagination.page,
      pageSize: pagination.limit,
      totalCount: pagination.totalItems,
      items: posts
    }
  },
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<any> {
    const query = { $or: [ { login: loginOrEmail }, { email: loginOrEmail } ] };
    const user: any = await usersCollection.findOne(query);
    if (user){
      return {
        // @ts-ignore
        id: user?._id,
        login: user?.login,
        email: user?.email,
        password: user?.password
      };
    }
    return null
  },
  async createUser(user: UserType): Promise<UserType> {
    const newUser = await usersCollection.insertOne({
      ...user
    })
    return { id: newUser?.insertedId?.toString(), ...user };
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
