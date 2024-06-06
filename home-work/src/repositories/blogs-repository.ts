type blog = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string
}

export let blogsDB: Array<blog> = []

export const blogsRepository = {
  findAllBlogs() {
    return blogsDB;
  },
  findBlogById(id: string) {
    return blogsDB.find(blog => blog.id === id);
  },
  createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog: blog = {
      id: (new Date()).toISOString(),
      name,
      description,
      websiteUrl
    }
    blogsDB = [...blogsDB, newBlog]
    return newBlog;
  },
  updateBlog(id: string, blog: {
    name: string,
    description: string,
    websiteUrl: string,
  }) {
    const index = blogsDB.findIndex(blog => blog.id === id);
    if (index !== -1) {
      blogsDB[index] = {
        ...blogsDB[index],
        ...blog
      };
    }
    return blogsDB;
  },
  deleteBlog(id: string) {
      for (let i = 0; i < blogsDB.length; i++) {
        if (blogsDB[i].id === id) {
          blogsDB.splice(i, 1);
          return true;
        }
      }
      return false;
    },
  deleteAllBlogs() {
    blogsDB = [];
    return true;
  }
}
