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
  deleteAllPosts() {
    postsDB = [];
    return true;
  }
}
