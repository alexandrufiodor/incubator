import { clientDB } from './db';
import { ObjectId } from 'mongodb';
import { getPaginationWithFilter } from '../utils/utils';
import { PostType } from './posts-repository';

export type BlogType = {
  id?: string,
  name: string,
  description: string,
  websiteUrl: string
  isMembership: boolean
  createdAt: string
}

export type BlogDBType = {
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

export const blogCollection = clientDB.collection<BlogType>('blogs');

export const blogsRepository = {
  async findAllBlogs(pageSize: string, pageNumber: string, searchNameTerm: string | null, sortBy: string, sortDirection: string): Promise<any> {
    const name = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {}
    const pagination = await getPaginationWithFilter(pageNumber, pageSize, blogCollection, name);
    // @ts-ignore
    const blogs: Array<BlogType> = (await blogCollection.find(name).sort({[`${sortBy}`]: sortDirection == 'desc' ? -1 : 1}).limit(pagination.limit).skip(pagination.offset).toArray())?.map((blog: BlogDBType) => {
      return {
        id: blog?._id,
        name: blog?.name,
        description: blog?.description,
        websiteUrl: blog?.websiteUrl,
        isMembership: blog?.isMembership,
        createdAt: blog?.createdAt
      }
    });
    return {
      pagesCount: pagination.totalPages,
      page: pagination.page,
      pageSize: pagination.limit,
      totalCount: pagination.totalItems,
      items: blogs
    }
  },
  async findBlogById(id: string): Promise<BlogType | null> {
    const blog: BlogType | null  = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (blog){
      return {
        // @ts-ignore
        id: blog?._id,
        name: blog?.name,
        description: blog?.description,
        websiteUrl: blog?.websiteUrl,
        isMembership: blog?.isMembership,
        createdAt: blog?.createdAt
      };
    }
    return null
  },
  async createBlog(blog: BlogType): Promise<BlogType> {
    const newBlog = await blogCollection.insertOne({
      ...blog
    });
    return {
      id: newBlog?.insertedId?.toString(),
      ...blog
    };
  },
  async updateBlog(id: string, blog: Omit<BlogType, "id" | "createdAt" | "isMembership">): Promise<Array<BlogType> | null> {
      const updatedBlog: any = await blogCollection.updateOne({ _id: new ObjectId(id) }, { "$set": { ...blog } })
      return updatedBlog;
  },
  async deleteBlog(id: string): Promise<boolean> {
      const deletedBlog: any = await blogCollection.deleteOne({  _id: new ObjectId(id) });
      return deletedBlog?.deletedCount === 1;
    },
  async deleteAllBlogs(): Promise<boolean> {
    const deletedBlogs: any = await blogCollection.deleteMany({});
    return deletedBlogs?.acknowledged;
  }
}
