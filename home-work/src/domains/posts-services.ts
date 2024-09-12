import { verifyId } from '../utils/utils';
import { blogsRepository, BlogType } from '../repositories/blogs-repository';
import { postsRepository, PostType } from '../repositories/posts-repository';
import { ObjectId } from 'mongodb';


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
  async findAllCommentsByPostId(pageSize: string, pageNumber: string, sortBy: string, sortDirection: string, postId: string): Promise<Array<any>> {
    return await postsRepository.findAllCommentsByPostId(pageSize, pageNumber, sortBy, sortDirection, { postId });
  },
  async createCommentByPostId(content: string, postId: string, user: any): Promise<any> {
    const findPost = await postsRepository.findPostById(postId)

    if (findPost) {
      const createdAt =  new Date().toISOString();
      const comment = {
        content,
        createdAt,
        commentatorInfo: {
          userId: user?.userId,
          userLogin: user?.login,
        },
        //@ts-ignore
        postId: findPost?._id?.toString()
      }
      const createdComment = await postsRepository.createCommentByPostId(comment)
      console.log('createdComment', createdComment);
      return {
        id: createdComment?.insertedId?.toString(),
        content,
        createdAt,
        commentatorInfo: {
          userId: user?.userId,
          userLogin: user?.login,
        },
      };
    } else{
      return undefined;
    }
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
