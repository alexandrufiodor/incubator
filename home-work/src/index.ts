import express from 'express'
import { videosRoutes } from './routes/videos-routes';
import { videosDB, videosRepository } from './repositories/videos-repository';
const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/api/videos', videosRoutes)
app.delete('/api/testing/all-data', (req, res) => {
  videosRepository.deleteAllVideos()
  res.status(204);
})

module.exports = app;
