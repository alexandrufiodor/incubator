import express from 'express'

export const app = express();
const port = 5000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.get('/', (req, res) => {
  return res.send('Hello Samurai')
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
