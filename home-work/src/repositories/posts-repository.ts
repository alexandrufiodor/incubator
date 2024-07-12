import { blogsRepository } from './blogs-repository';

type PostType = {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string
}

export let postsDB: Array<PostType> = []

export const postsRepository = {
  async findAllPosts(): Promise<Array<PostType>> {
    return postsDB;
  },
  async findPostById(id: string): Promise<PostType | undefined> {
    return postsDB.find((post:PostType) => post.id === id);
  },
  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType | undefined> {
    const findBlog = await blogsRepository.findBlogById(blogId)
    if (findBlog) {
      const newPost: PostType = {
        id: (new Date()).toISOString(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: findBlog?.name
      }
      postsDB = [...postsDB, newPost]
      return newPost;
    }
  },
  async updatePost(id: string, post: {
    title: string, shortDescription: string, content: string, blogId: string
  }): Promise<Array<PostType> | undefined> {
    const findBlog = await blogsRepository.findBlogById(post?.blogId)
    if (findBlog) {
      const index = postsDB.findIndex(post => post.id === id);
      if (index !== -1) {
        postsDB[index] = {
          ...postsDB[index],
          ...post,
          blogName: findBlog?.name
        };
      }
      return postsDB;
    }
  },
  async deletePost(id: string) : Promise<boolean> {
    for (let i = 0; i < postsDB.length; i++) {
      if (postsDB[i].id === id) {
        postsDB.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  async deleteAllPosts(): Promise<boolean> {
    postsDB = [];
    return true;
  }
}
