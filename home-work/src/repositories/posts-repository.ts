import { clientDB } from './db';
import { ObjectId } from 'mongodb';
import { verifyId } from '../utils/utils';

export type PostType = {
  id?: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  createdAt?: string,
  blogName: string
}

export type PostDBType = {
  _id: string,
  insertedId?: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string
}

export const postsRepository = {
  async findAllPosts(): Promise<Array<PostType>> {
    return (await clientDB.collection<PostDBType>('posts').find({}).toArray())?.map((post: PostDBType) => {
      const returnedPost = {
        ...post,
        id: post._id
      }
      // @ts-ignore
      delete returnedPost._id;
      return returnedPost
    });
  },
  async findPostById(id: string): Promise<PostType | null> {
      return await clientDB.collection<PostType>('posts').findOne({ _id: new ObjectId(id) });
  },
  async createPost(post: PostType): Promise<{ insertedId: string }> {
      const newPost = await clientDB.collection<PostType>('posts').insertOne({
        ...post
      })
      return { insertedId: newPost?.insertedId?.toString() };
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined | null> {
      const updatedPost: any = await clientDB.collection<PostType>('posts').updateOne({ _id: new ObjectId(id) }, { "$set": { ...post } })
      return updatedPost;
  },
  async deletePost(id: string) : Promise<boolean> {
      const deletedPost: any = await clientDB.collection<PostType>('posts').deleteOne({ _id: new ObjectId(id) });
      return deletedPost?.deletedCount === 1;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedPosts: any = await clientDB.collection<PostType>('posts').deleteMany({});
    return deletedPosts?.acknowledged;
  }
}
