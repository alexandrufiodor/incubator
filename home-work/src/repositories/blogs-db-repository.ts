import { clientDB } from './db';
import { ObjectId } from 'mongodb';

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
  insertedId: string,
  id: string,
  name: string,
  description: string,
  websiteUrl: string
  isMembership: boolean
  acknowledged: boolean
  createdAt: string
}

export const blogsDbRepository = {
  async findAllBlogs(): Promise<Array<BlogType>> {
    return (await clientDB.collection<BlogDBType>('blogs').find({}).toArray())?.map((blog: BlogDBType) => {
      return {
        id: blog?.id,
        name: blog?.name,
        description: blog?.description,
        websiteUrl: blog?.websiteUrl,
        isMembership: blog?.isMembership,
        createdAt: blog?.createdAt
      }
    });
  },
  async findBlogById(id: string): Promise<BlogType | null> {
    const blog: BlogType | null  = await clientDB.collection<BlogType>('blogs').findOne({ _id: new ObjectId(id) });
    if (blog){
      return {
        id: blog?.id,
        name: blog?.name,
        description: blog?.description,
        websiteUrl: blog?.websiteUrl,
        isMembership: blog?.isMembership,
        createdAt: blog?.createdAt
      };
    } else {
      return null;
    }
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const newId = new ObjectId().toString();
    await clientDB.collection<BlogType>('blogs').insertOne({
      id: newId,
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
    return {
      id: newId,
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
  },
  async updateBlog(id: string, blog: Omit<BlogType, "id" | "createdAt" | "isMembership">): Promise<Array<BlogType>> {
    const updatedBlog: any = await clientDB.collection<BlogType>('blogs').updateOne({  id }, {"$set": {...blog}})
    return updatedBlog;
  },
  async deleteBlog(id: string): Promise<boolean> {
      const deletedBlog: any = await clientDB.collection<BlogType>('blogs').deleteOne({  id });
      return deletedBlog?.deletedCount === 1;
    },
  async deleteAllBlogs(): Promise<boolean> {
    const deletedBlogs: any = await clientDB.collection<BlogType>('blogs').deleteMany({});
    return deletedBlogs?.acknowledged;
  }
}
