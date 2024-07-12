type BlogType = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string
}

export let blogsDB: Array<BlogType> = []

export const blogsRepository = {
  async findAllBlogs(): Promise<Array<BlogType>> {
    return blogsDB;
  },
  async findBlogById(id: string):  Promise<BlogType | undefined> {
    return blogsDB.find(blog => blog.id === id);
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
    const newBlog: BlogType = {
      id: (new Date()).toISOString(),
      name,
      description,
      websiteUrl
    }
    blogsDB = [...blogsDB, newBlog]
    return newBlog;
  },
  async updateBlog(id: string, blog: {
    name: string,
    description: string,
    websiteUrl: string,
  }): Promise<Array<BlogType>> {
    const index = blogsDB.findIndex(blog => blog.id === id);
    if (index !== -1) {
      blogsDB[index] = {
        ...blogsDB[index],
        ...blog
      };
    }
    return blogsDB;
  },
  async deleteBlog(id: string): Promise<boolean> {
      for (let i = 0; i < blogsDB.length; i++) {
        if (blogsDB[i].id === id) {
          blogsDB.splice(i, 1);
          return true;
        }
      }
      return false;
    },
  async deleteAllBlogs(): Promise<boolean> {
    blogsDB = [];
    return true;
  }
}
