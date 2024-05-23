import express from "express";

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let products = [{
  id: 1,
  title: 'orange',
}, {
  id: 2,
  title: 'tomato',
}]

app.get('/products', (req: any, res: any) => {
  let findProducts = products
  if (req?.query?.title) {
    findProducts = products.filter(product => product.title.toLowerCase().includes(req?.query?.title?.toLowerCase()));
  }
  res.send(findProducts)
})

app.get('/products/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findProduct = products.find(product => product.id === +req.params.id);
  if (!findProduct) {
    res.sendStatus(404);
  }
  res.send(findProduct)
})

app.post('/products', (req: any, res: any) => {
  if (!req.body?.title) {
    res.status(400).send('Title is required!');
    return
  }

  const newProduct = {id: products?.[products?.length -1]?.id + 1, title: req.body?.title}
  products = [...products, newProduct]
  return res.status(201).send(newProduct);
})

app.put('/products/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  const findProduct = products.find(product => product.id === +req.params.id);
  if (!findProduct) {
    res.sendStatus(404);
    return
  }
  products = products.map(product => {
    if (product.id === +req.params.id) {
      return {...product, title: req.body.title};
    }
    return {...product};
  })
  res.status(200).json(products);
})

app.delete('/products/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.id) {
      products.splice(i, 1);
      return res.send(204);
    }
  }
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

