import { blogsRepository } from './blogs-repository';
import { clientDB } from './db';
import { ObjectId } from 'mongodb';

type PostType = {
  id?: string,
  title: string,
  shortDescription: string,
  content: string,
  // blogId: string,
  // blogName: string
}

type PostDBType = {
  _id: string,
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  // blogId: string,
  // blogName: string
}

export const postsRepository = {
  async findAllPosts(): Promise<Array<PostType>> {
    return (await clientDB.collection<PostDBType>('posts').find({}).toArray())?.map((post: PostDBType) => {
      const returnedPost = {
        ...post
      }
      // @ts-ignore
      delete returnedPost._id;
      return returnedPost
    });
  },
  async findPostById(id: string): Promise<PostType | null> {
    const blog: PostType | null  = await clientDB.collection<PostType>('posts').findOne({  _id: new ObjectId(id) });
    if (blog) {
      return blog;
    }
    return null;
  },
  async createPost(title: string, shortDescription: string, content: string): Promise<PostType | undefined> {
    const newId = new ObjectId().toString();
    await clientDB.collection<PostType>('posts').insertOne({
      id: newId,
      title,
      shortDescription,
      content,
    });
    return {
      id: newId,
      title,
      shortDescription,
      content,
    };
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined> {
    const updatedPost: any = await clientDB.collection<PostType>('posts').updateOne({  id }, {"$set": {...post}})
    return updatedPost;
  },
  async deletePost(id: string) : Promise<boolean> {
    const deletedPost: any = await clientDB.collection<PostType>('posts').deleteOne({  id });
    return deletedPost?.deletedCount === 1;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedPosts: any = await clientDB.collection<PostType>('posts').deleteMany({});
    console.log('deletedBlogs', deletedPosts);
    return deletedPosts?.acknowledged;
  }
}
