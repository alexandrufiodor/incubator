import { blogsRepository } from './blogs-repository';
import { clientDB } from './db';
import { ObjectId } from 'mongodb';
import { verifyId } from '../utils/utils';
import { blogsDbRepository } from './blogs-db-repository';

type PostType = {
  id?: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  createdAt?: string,
  blogName: string
}

type PostDBType = {
  _id: string,
  id: string,
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
    if (verifyId(id)) {
      const post: PostType | null = await clientDB.collection<PostType>('posts').findOne({ _id: new ObjectId(id) });
      if (post) {
        return {
          // @ts-ignore
          id: post._id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          createdAt: post.createdAt,
          blogId: post.blogId,
          blogName: post.blogName
        };
      }
    }
    return null;
  },
  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | undefined> {
    const findBlog = await blogsDbRepository.findBlogById(blogId)
    if (findBlog) {
      const createdAt =  new Date().toISOString();
      const post = await clientDB.collection<PostType>('posts').insertOne({
        title,
        shortDescription,
        content,
        blogId,
        createdAt,
        blogName: findBlog?.name
      });
      return {
        id: post?.insertedId?.toString(),
        title,
        shortDescription,
        content,
        createdAt,
        blogId,
        blogName: findBlog?.name
      };
    }
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined | null> {
    if (verifyId(id)) {
      const findPost = await postsRepository.findPostById(id);
      if (findPost) {
        const updatedPost: any = await clientDB.collection<PostType>('posts').updateOne({ _id: new ObjectId(id) }, { "$set": { ...post } })
        return updatedPost;
      }
    }
    return null;
  },
  async deletePost(id: string) : Promise<boolean> {
    if (verifyId(id)) {
      const deletedPost: any = await clientDB.collection<PostType>('posts').deleteOne({ _id: new ObjectId(id) });
      return deletedPost?.deletedCount === 1;
    }
    return false;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedPosts: any = await clientDB.collection<PostType>('posts').deleteMany({});
    return deletedPosts?.acknowledged;
  }
}
