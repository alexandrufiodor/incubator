import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { postsRepository } from '../repositories/posts-repository';
import { blogsRepository } from '../repositories/blogs-repository';

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
  .custom((value) => {
    const blog = blogsRepository.findBlogById(value);
    if (!blog) {
      return Promise.reject('Blog with this blogId does not exist');
    }
    return true
  })


postsRoutes.get('/', (req, res) => {
  res.send(postsRepository.findAllPosts())
});
postsRoutes.get('/:id', (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findPost = postsRepository.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
  }
  res.send(findPost)
})
postsRoutes.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, (req, res) => {
  const createdPost = postsRepository.createPost(req.body?.title, req.body?.shortDescription, req.body?.content, req.body?.blogId)
  if (createdPost) {
    res.status(201).send(createdPost);
  } else {
    res.sendStatus(404)
  }
})
postsRoutes.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findPost = postsRepository.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
  }
  const updatedPost = postsRepository.updatePost(req.params.id, req.body)
  if (updatedPost) {
    res.sendStatus(204);
  }
})
postsRoutes.delete('/:id',authMiddleware, (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  if (postsRepository.deletePost(req.params.id)) {
    res.send(204);
  }
  res.sendStatus(404);
})
