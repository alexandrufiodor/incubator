import { Router } from 'express';
import { addressesRepository } from '../repositories/addresses-repository';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/middlewares';

export const addressesRoutes = Router();

const valueValidation = body('value').trim().isLength({min: 3, max: 10}).withMessage('Value length should be from 3 to 10 symbols')


addressesRoutes.get('/', (req: any, res: any) => {
  res.send(addressesRepository.findAddresses(req?.query?.value))
})

addressesRoutes.get('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findAddress =  addressesRepository.findAddressById(+req.params.id);
  if (!findAddress) {
    res.sendStatus(404);
  }
  res.send(findAddress)
})

addressesRoutes.post('/', valueValidation, inputValidationMiddleware ,(req: any, res: any) => {
  return res.status(201).send(addressesRepository.createAddress(req.body?.value));
})

addressesRoutes.put('/:id', valueValidation, inputValidationMiddleware ,(req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  const findAddress = addressesRepository.findAddressById(+req.params.id);
  if (!findAddress) {
    res.sendStatus(404);
    return
  }
  res.status(200).json(addressesRepository.updateAddress(+req.params.id, req.body.value));
})

addressesRoutes.delete('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }

  if (addressesRepository.deleteAddress(+req.params.id)) {
    return res.send(204);
  }
  res.sendStatus(404)
})
