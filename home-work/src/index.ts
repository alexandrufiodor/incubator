//@ts-ignore
import express from 'express'
import { blogs } from './routes/blogs';
import { posts } from './routes/posts';
import { runDB } from './repositories/db';
import { blogsServices } from './domains/blogs-services';
import { postsServices } from './domains/posts-services';
import { users } from './routes/users';
import { usersServices } from './domains/users-services';
import { auth } from './routes/auth';
import { comments } from './routes/comments';
import { commentsService } from './domains/comments-services';
import { email } from './routes/email';
const app = express();
import cookieParser = require("cookie-parser")

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);
app.use(cookieParser());

app.use('/api/email', email);
app.use('/api/blogs', blogs);
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/comments', comments);
app.delete('/api/testing/all-data', async (req, res) => {
  await postsServices.deleteAllPosts();
  await blogsServices.deleteAllBlogs();
  await usersServices.deleteAllUsers();
  await commentsService.deleteAllComments();
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await runDB();
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
