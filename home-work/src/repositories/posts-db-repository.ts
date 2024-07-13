import { blogsRepository } from './blogs-repository';
import { clientDB } from './db';
import { ObjectId } from 'mongodb';

type PostType = {
  id?: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
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
    const post: PostType | null  = await clientDB.collection<PostType>('posts').findOne({  _id: new ObjectId(id) });
    if (post) {
      return {
        // @ts-ignore
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName
      };
    }
    return null;
  },
  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | undefined> {
    const findBlog = await blogsRepository.findBlogById(blogId)
    if (findBlog) {
    const post: any = await clientDB.collection<PostType>('posts').insertOne({
      title,
      shortDescription,
      content,
      blogId,
      blogName: findBlog?.name
    });
    return {
      id: post?.insertedId?.toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: findBlog?.name
    };
    }
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined> {
    const updatedPost: any = await clientDB.collection<PostType>('posts').updateOne({  _id: new ObjectId(id)}, {"$set": {...post}})
    return updatedPost;
  },
  async deletePost(id: string) : Promise<boolean> {
    const deletedPost: any = await clientDB.collection<PostType>('posts').deleteOne({  _id: new ObjectId(id) });
    return deletedPost?.deletedCount === 1;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedPosts: any = await clientDB.collection<PostType>('posts').deleteMany({});
    return deletedPosts?.acknowledged;
  }
}
