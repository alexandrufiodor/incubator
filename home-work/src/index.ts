import express from 'express'
import { videosRoutes } from './routes/videos-routes';
import { videosRepository } from './repositories/videos-repository';
import { blogsRoutes } from './routes/blogs-routes';
import { postsRoutes } from './routes/posts-routes';
import { postsRepository } from './repositories/posts-db-repository';
import { blogsDbRepository } from './repositories/blogs-db-repository';
import { runDB } from './repositories/db';
const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

// app.use('/api/videos', videosRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/posts', postsRoutes);
app.delete('/api/testing/all-data', async (req, res) => {
  await videosRepository.deleteAllVideos();
  await postsRepository.deleteAllPosts();
  await blogsDbRepository.deleteAllBlogs();
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await runDB();
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
