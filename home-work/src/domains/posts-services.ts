import { verifyId } from '../utils/utils';
import { blogsRepository } from '../repositories/blogs-repository';
import { postsRepository, PostType } from '../repositories/posts-repository';


export const postsServices = {
  async findAllPosts(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string): Promise<Array<PostType>> {
    return await postsRepository.findAllPosts(pageSize,pageNumber, sortBy, sortDirection);
  },
  async findPostById(id: string): Promise<PostType | null> {
    if (verifyId(id)) {
      const post: PostType | null = await postsRepository.findPostById(id)
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
    const findBlog = await blogsRepository.findBlogById(blogId)
    if (findBlog) {
      const createdAt =  new Date().toISOString();
      const post = {
        title,
        shortDescription,
        content,
        blogId,
        createdAt,
        blogName: findBlog?.name
      }
      const createdPost = await postsRepository.createPost(post)
      return {
        id: createdPost?.insertedId?.toString(),
        ...post
      };
    }
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string
  }): Promise<Array<PostType> | undefined | null> {
    if (verifyId(id)) {
      const findPost = await postsRepository.findPostById(id);
      if (findPost) {
        const updatedPost: any =  await postsRepository.updatePost(id, post);
        return updatedPost;
      }
    }
    return null;
  },
  async deletePost(id: string) : Promise<boolean> {
    if (verifyId(id)) {
      return await postsRepository.deletePost(id);
    }
    return false;
  },
  async deleteAllPosts(): Promise<boolean> {
    return await postsRepository.deleteAllPosts()
  }
}
