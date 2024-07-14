import { clientDB } from './db';
import { ObjectId } from 'mongodb';
import { getPaginationWithFilter, verifyId } from '../utils/utils';

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
  createdAt?: string,
  blogName: string
}

export const postsCollection = clientDB.collection<PostType>('posts');

export const postsRepository = {
  async findAllPosts(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, filter = {}): Promise<any> {
    const pagination = await getPaginationWithFilter(pageNumber, pageSize, postsCollection, filter);
    //@ts-ignore
    const posts: Array<PostType> = (await postsCollection.find(filter).sort({[`${sortBy}`]: sortDirection == 'desc' ? 1 : -1}).limit(pagination.limit).skip(pagination.offset).toArray())?.map((post: PostDBType) => {
      return {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt,
        id: post._id
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
  async findPostById(id: string): Promise<PostType | null> {
      return await postsCollection.findOne({ _id: new ObjectId(id) });
  },
  async createPost(post: PostType): Promise<{ insertedId: string }> {
      const newPost = await postsCollection.insertOne({
        ...post
      })
      return { insertedId: newPost?.insertedId?.toString() };
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined | null> {
      const updatedPost: any = await postsCollection.updateOne({ _id: new ObjectId(id) }, { "$set": { ...post } })
      return updatedPost;
  },
  async deletePost(id: string) : Promise<boolean> {
      const deletedPost: any = await postsCollection.deleteOne({ _id: new ObjectId(id) });
      return deletedPost?.deletedCount === 1;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedPosts: any = await postsCollection.deleteMany({});
    return deletedPosts?.acknowledged;
  }
}
