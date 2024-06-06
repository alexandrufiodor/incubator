import { blogsRepository } from './blogs-repository';

type post = {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string
}

export let postsDB: Array<post> = []

export const postsRepository = {
  findAllPosts() {
    return postsDB;
  },
  findPostById(id: string) {
    return postsDB.find(post => post.id === id);
  },
  createPost(title: string, shortDescription: string, content: string, blogId: string) {
    const findBlog = blogsRepository.findBlogById(blogId)
    if (findBlog) {
      const newPost: post = {
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
  updatePost(id: string, post: {
    title: string, shortDescription: string, content: string, blogId: string
  }) {
    const findBlog = blogsRepository.findBlogById(post?.blogId)
    if (findBlog) {
      const index = postsDB.findIndex(post => post.id === id);
      if (index !== -1) {
        postsDB[index] = {
          ...postsDB[index],
          ...post,
          blogId: findBlog?.name
        };
      }
      return postsDB;
    }
  },
  deletePost(id: string) {
    for (let i = 0; i < postsDB.length; i++) {
      if (postsDB[i].id === id) {
        postsDB.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  deleteAllPosts() {
    postsDB = [];
    return true;
  }
}
