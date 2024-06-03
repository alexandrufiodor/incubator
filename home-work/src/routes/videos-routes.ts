import express from 'express';
import { videosRepository } from '../repositories/videos-repository';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/middlewares';

export const videosRoutes = express.Router();

const titleValidation = body('title')
  .notEmpty()
  .withMessage('Title field is required.')
  .trim()
  .isLength({min: 0, max: 40})
  .withMessage('Title length should be from 0 to 40 symbols')
const authorValidation = body('author')
  .notEmpty()
  .withMessage('Author field is required.')
  .trim()
  .isLength({min: 0, max: 20})
  .withMessage('Author length should be from 0 to 20 symbols')
const availableResolutionsValidation = body('availableResolutions')
  .if(body('availableResolutions').exists({ checkNull: true, checkFalsy: true }))
  .isIn(['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'])
  .withMessage('Resolution should be one from the \'P144\', \'P240\', \'P360\', \'P480\', \'P720\', \'P1080\', \'P1440\', \'P2160')

videosRoutes.get('/', (req: any, res: any) => {
  res.send(videosRepository.findAllVideos())
})

videosRoutes.get('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findVideo = videosRepository.findVideosById(+req.params.id);
  if (!findVideo) {
    res.sendStatus(404);
  }
  res.send(findVideo)
})

videosRoutes.post('/', titleValidation, authorValidation, availableResolutionsValidation, inputValidationMiddleware, (req: any, res: any) => {
  return res.status(201).send(videosRepository.createVideo(req.body?.title, req.body?.author, req.body?.availableResolutions));
})

videosRoutes.put('/:id', titleValidation, authorValidation, availableResolutionsValidation, inputValidationMiddleware, (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  const findVideo = videosRepository.findVideosById(+req.params.id);
  if (!findVideo) {
    res.sendStatus(404);
    return
  }
  res.status(200).json(videosRepository.updateVideo(+req.params.id, req.body));
})

videosRoutes.delete('/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  if (videosRepository.deleteVideo(+req.params.id)) {
    return res.send(204);
  }
  res.sendStatus(404);
})