import express from 'express'
// import { videosRoutes } from './routes/videos-routes';

export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let db: any = []
app.get('/videos', (req: any, res: any) => {
  res.json(db);
})
// app.use('/videos', videosRoutes)

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
