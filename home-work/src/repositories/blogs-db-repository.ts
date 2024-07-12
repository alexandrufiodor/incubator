import { clientDB } from './db';

type BlogType = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string
  isMembership: boolean
  createdAt: string
}

type BlogDBType = {
  _id: string,
  name: string,
  description: string,
  websiteUrl: string
  isMembership: boolean
  createdAt: string
}

export const blogsDbRepository = {
  async findAllBlogs(): Promise<Array<BlogType>> {
    return (await clientDB.collection<BlogDBType>('blogs').find({}).toArray())?.map((blog: BlogDBType) => {
      const returnedBlog = {
        ...blog,
        id: blog._id,
      }
      // @ts-ignore
      delete returnedBlog._id;
      return returnedBlog
    });
  },
  async findBlogById(id: string):  Promise<BlogType | null> {
    const blog: BlogType | null  = await clientDB.collection<BlogType>('blogs').findOne({ id });
    if (blog) {
      return blog;
    }
    return null;
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const blog: any = await clientDB.collection<Omit<BlogType, "id">>('blogs').insertOne({
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    });
    return blog;
  },
  async updateBlog(id: string, blog: Omit<BlogType, "id" | "createdAt" | "isMembership">): Promise<Array<BlogType>> {
    const updatedBlog: any = await clientDB.collection<BlogType>('blogs').updateOne({ id }, {...blog})
    return updatedBlog;
  },
  async deleteBlog(id: string): Promise<boolean> {
      const deletedBlog: any = await clientDB.collection<BlogType>('blogs').deleteOne({ id });
      return deletedBlog === 1;
    },
  async deleteAllBlogs(): Promise<boolean> {
    const deletedBlogs: any = await clientDB.collection<BlogType>('blogs').deleteMany({});
    return deletedBlogs === 1;
  }
}
