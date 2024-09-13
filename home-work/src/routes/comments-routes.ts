import { body } from 'express-validator';
import { Router } from 'express';
import { commentsService } from '../domains/comments-services';
import { authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';

export const commentsRouter = Router();

export const commentContentValidation = body('content')
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

commentsRouter.put('/:id', authWithBarearTokenMiddleware, commentContentValidation, inputValidationMiddleware, async (req: any, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return
  }
  if (req?.user) {
    const comment = await commentsService.findCommentById(req.params.id);
    if (comment?.commentatorInfo?.userId === req?.user?.userId) {
      const updatedComment = await commentsService.updateCommentById(req.params.id?.toString(), req.body?.content);
      if (updatedComment) {
        res.sendStatus(204);
        return;
      }
    } else {
      res.sendStatus(403)
      return
    }
  }
  res.sendStatus(404);
  return;
})
commentsRouter.delete('/:id', authWithBarearTokenMiddleware, async (req: any, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  if (req?.user) {
    const comment = await commentsService.findCommentById(req.params.id);
    if (comment?.commentatorInfo?.userId === req?.user?.userId) {
      const deletedComment = await commentsService.deleteComment(req.params.id?.toString());
      if (deletedComment) {
        res.sendStatus(204)
        return;
      }
    } else {
      res.sendStatus(403)
      return
    }
  }
  res.sendStatus(404);
  return;
})
