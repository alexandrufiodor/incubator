import { blogsRepository } from './blogs-repository';
import { clientDB } from './db';

type PostType = {
  _id?: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string
}

export const postsRepository = {
  async findAllPosts(): Promise<Array<PostType>> {
    return (await clientDB.collection<PostType>('posts').find({}).toArray())?.map((post: PostType) => {
      const returnedPost = {
        ...post,
        id: post._id,
      }
      // @ts-ignore
      delete returnedPost._id;
      return returnedPost
    });
  },
  async findPostById(id: string): Promise<PostType | null> {
    const blog: PostType | null  = await clientDB.collection<PostType>('posts').findOne({ id });
    if (blog) {
      return blog;
    }
    return null;
  },
  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | undefined> {
    const findBlog = await blogsRepository.findBlogById(blogId)
    if (findBlog) {
    const post: any = await clientDB.collection<Omit<PostType, "id">>('posts').insertOne({
      title,
      shortDescription,
      content,
      blogId,
      blogName: findBlog?.name
    });
    return post;
    }
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string, blogId: string
  }): Promise<Array<PostType> | undefined> {
    const updatedPost: any = await clientDB.collection<PostType>('posts').updateOne({ id }, {...post})
    return updatedPost;
  },
  async deletePost(id: string) : Promise<boolean> {
    const deletedPost: any = await clientDB.collection<PostType>('posts').deleteOne({ id });
    return deletedPost === 1;
  },
  async deleteAllPosts(): Promise<boolean> {
    const deletedBlogs: any = await clientDB.collection<PostType>('posts').deleteMany({});
    return deletedBlogs === 1;
  }
}
