import express from "express";
import { productsRoutes } from './routes/products-routes';
import { addressesRoutes } from './routes/addresses-routes';

export const app = express()
const port = 3000

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/products', productsRoutes);
app.use('/addresses', addressesRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

