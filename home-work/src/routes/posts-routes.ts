import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { postsRepository } from '../repositories/posts-db-repository';
import { blogsDbRepository } from '../repositories/blogs-db-repository';

export const postsRoutes = Router();

const titleValidation = body('title')
  .notEmpty()
  .withMessage('Title field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 30 })
  .withMessage('Title length should be from 0 to 30 symbols');
const shortDescriptionValidation = body('shortDescription')
  .notEmpty()
  .withMessage('shortDescription field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 100 })
  .withMessage('shortDescription length should be from 0 to 100 symbols');
const contentValidation = body('content')
  .notEmpty()
  .withMessage('content field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 1000 })
  .withMessage('content length should be from 0 to 1000 symbols');
const blogIdValidation = body('blogId')
  .notEmpty()
  .withMessage('blogId field is required.')
  .custom(async (value) => {
    const blog = await blogsDbRepository.findBlogById(value);
    if (!blog) {
      return Promise.reject('Blog with this blogId does not exist');
    }
    return true
  })


postsRoutes.get('/', async (req, res) => {
  res.send(await postsRepository.findAllPosts())
});
postsRoutes.get('/:id', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const findPost = await postsRepository.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
    return;
  }
  res.send(findPost)
})
postsRoutes.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, async (req, res) => {
  const createdPost = await postsRepository.createPost(req.body?.title, req.body?.shortDescription, req.body?.content, )
  if (createdPost) {
    res.status(201).send(createdPost);
  } else {
    res.sendStatus(404)
  }
})
postsRoutes.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const findPost = await postsRepository.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
    return;
  }
  const updatedPost = await postsRepository.updatePost(req.params.id, req.body)
  if (updatedPost) {
    res.sendStatus(204);
  }
})
postsRoutes.delete('/:id',authMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  if (await postsRepository.deletePost(req.params.id)) {
    res.send(204);
    return;
  }
  res.sendStatus(404);
})
