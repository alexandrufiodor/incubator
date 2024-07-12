import { Router } from 'express';
import { videosRepository } from '../repositories/videos-repository';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';

export const videosRoutes = Router();

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
const minAgeRestriction = body('minAgeRestriction')
  .optional({ nullable: true })
  .isInt({ min: 1, max: 18 })
  .withMessage('Age must be an integer between 1 and 18.')
const publicationDate = body('publicationDate')
    .isISO8601()
    .withMessage('Invalid date-time format. Must be ISO 8601.')
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    .withMessage('Date-time must be in the format YYYY-MM-DDTHH:mm:ss.sssZ.')
const canBeDownloaded = body('canBeDownloaded')
  .isBoolean()
  .withMessage('canBeDownloaded should be boolean')

videosRoutes.get('/', authMiddleware, async (req: any, res: any) => {
  res.send(await videosRepository.findAllVideos())
})

videosRoutes.get('/:id', async (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findVideo = await videosRepository.findVideosById(+req.params.id);
  if (!findVideo) {
    res.sendStatus(404);
  }
  res.send(findVideo)
})

videosRoutes.post('/', titleValidation, authorValidation, availableResolutionsValidation, inputValidationMiddleware, async (req: any, res: any) => {
  res.status(201).send(await videosRepository.createVideo(req.body?.title, req.body?.author, req.body?.availableResolutions));
})

videosRoutes.put('/:id', titleValidation, authorValidation, availableResolutionsValidation, minAgeRestriction, canBeDownloaded, publicationDate, inputValidationMiddleware, async (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findVideo = await videosRepository.findVideosById(+req.params.id);
  if (!findVideo) {
    res.sendStatus(404);
  }
  const updatedVideo = await videosRepository.updateVideo(+req.params.id, req.body)
  if (updatedVideo) {
    res.sendStatus(204);
  }
})

videosRoutes.delete('/:id', async (req: any, res: any) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  if (await videosRepository.deleteVideo(+req.params.id)) {
      res.send(204);
  }
  res.sendStatus(404);
})
