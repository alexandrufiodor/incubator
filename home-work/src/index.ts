import express from 'express'
import { blogsRoutes } from './routes/blogs-routes';
import { postsRoutes } from './routes/posts-routes';
import { runDB } from './repositories/db';
import { blogsServices } from './domains/blogs-services';
import { postsServices } from './domains/posts-services';
import { usersRoutes } from './routes/users-routes';
import { usersServices } from './domains/users-services';
import { authRoutes } from './routes/auth-routes';
import { commentsRouter } from './routes/comments-routes';
import { commentsService } from './domains/comments-services';
const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/api/blogs', blogsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRouter);
app.delete('/api/testing/all-data', async (req, res) => {
  // await postsServices.deleteAllPosts();
  // await blogsServices.deleteAllBlogs();
  // await usersServices.deleteAllUsers();
  // await commentsService.deleteAllComments();
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await runDB();
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
