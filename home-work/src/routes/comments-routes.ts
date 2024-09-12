import { body } from 'express-validator';
import { Router } from 'express';
import { commentsService } from '../domains/comments-services';
import { authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';

export const commentsRouter = Router();

const contentValidation = body('content')
  .notEmpty()
  .withMessage('Content field is required.')
  .isString()
  .isLength({min: 20, max: 300 })
  .withMessage('Content length should be from 20 to 300 symbols');


commentsRouter.get('/:id', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
  }
  const findComment = await commentsService.findCommentById(req.params.id);
  if (!findComment) {
    res.sendStatus(404);
    return;
  }
  res.send(findComment)
})

commentsRouter.put('/:id', authWithBarearTokenMiddleware, contentValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return
  }

  const updatedComment = await commentsService.updateCommentById(req.params.id?.toString(), req.body?.content);
  if (updatedComment) {
    res.sendStatus(204);
    return;
  }
  res.sendStatus(404);
})
commentsRouter.delete('/:id', authWithBarearTokenMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const deletedComment = await commentsService.deleteComment(req.params.id?.toString());
  if (deletedComment) {
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404);
})
