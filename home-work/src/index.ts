import express from 'express'
import { videosRoutes } from './routes/videos-routes';
import { videosRepository } from './repositories/videos-repository';
import { blogsRoutes } from './routes/blogs-routes';
import { postsRoutes } from './routes/posts-routes';
import { postsRepository } from './repositories/posts-repository';
import { blogsRepository } from './repositories/blogs-repository';
const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/api/videos', videosRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/posts', postsRoutes);
app.delete('/api/testing/all-data', (req, res) => {
  videosRepository.deleteAllVideos();
  postsRepository.deleteAllPosts();
  blogsRepository.deleteAllBlogs();
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
