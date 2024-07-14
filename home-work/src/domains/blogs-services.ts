import { verifyId } from '../utils/utils';
import { blogsRepository, BlogType } from '../repositories/blogs-repository';

export const blogsServices = {
  async findAllBlogs(): Promise<Array<BlogType>> {
    return await blogsRepository.findAllBlogs();
  },
  async findBlogById(id: string): Promise<BlogType | null> {
    if (verifyId(id)) {
      return await blogsRepository.findBlogById(id);
    }
    return null;
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const createdAt =  new Date().toISOString();
    const blog = {
      name,
      description,
      websiteUrl,
      createdAt,
      isMembership: false
    }
    return await blogsRepository.createBlog(blog);
  },
  async updateBlog(id: string, blog: Omit<BlogType, "id" | "createdAt" | "isMembership">): Promise<Array<BlogType> | null> {
    if (verifyId(id)) {
      const findBlog = await blogsRepository.findBlogById(id);
      if (findBlog) {
        return await blogsRepository.updateBlog(id, blog);
      }
    }
    return null;
  },
  async deleteBlog(id: string): Promise<boolean> {
    if (verifyId(id)) {
      const deletedBlog: any = await blogsRepository.deleteBlog(id);
      return deletedBlog?.deletedCount === 1;
    }
    return false;
  },
  async deleteAllBlogs(): Promise<boolean> {
    const deletedBlogs: any = await blogsRepository.deleteAllBlogs();
    return deletedBlogs?.acknowledged;
  }
}
