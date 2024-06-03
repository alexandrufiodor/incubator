import { Router } from 'express';
import { productRepository } from '../repositories/products-repository';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/middlewares';

export const productsRoutes = Router();

const titleValidation = body('title').trim().isLength({min: 3, max: 10}).withMessage('Title length should be from 3 to 10 symbols')
productsRoutes.get('/', (req: any, res: any) => {
  res.send(productRepository.findProducts(req?.query?.title?.toLowerCase()))
})

productsRoutes.get('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findProduct = productRepository.findProductById(+req.params.id);
  if (!findProduct) {
    res.sendStatus(404);
  }
  res.send(findProduct)
})

productsRoutes.post('/', titleValidation, inputValidationMiddleware, (req: any, res: any) => {
  return res.status(201).send(productRepository.createProduct(req.body?.title));
})

productsRoutes.put('/:id', titleValidation, inputValidationMiddleware, (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  const findProduct = productRepository.findProductById(+req.params.id);
  if (!findProduct) {
    res.sendStatus(404);
    return
  }
  res.status(200).json(productRepository.updateProduct(+req.params.id, req.body.title));
})

productsRoutes.delete('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  if (productRepository.deleteProduct(+req.params.id)) {
    return res.send(204);
  }
  res.sendStatus(404);
})
