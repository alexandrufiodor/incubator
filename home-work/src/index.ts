import express from 'express'
import { videosRoutes } from './routes/videos-routes';
const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/videos', videosRoutes)

module.exports = app;
