import { verifyId } from '../utils/utils';
import { blogsRepository, BlogType } from '../repositories/blogs-repository';

export const blogsServices = {
  async findAllBlogs(pageSize: string, pageNumber: string, searchNameTerm: string | null, sortBy: string, sortDirection: string): Promise<Array<BlogType>> {
    return await blogsRepository.findAllBlogs(pageSize, pageNumber, searchNameTerm, sortBy, sortDirection);
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
      return await blogsRepository.deleteBlog(id);
    }
    return false;
  },
  async deleteAllBlogs(): Promise<boolean> {
    return await blogsRepository.deleteAllBlogs();
  }
}
