import { Router } from 'express';
import { blogsRepository } from '../repositories/blogs-repository';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';

export const blogsRoutes = Router();

const nameValidation = body('name')
  .notEmpty()
  .withMessage('Name field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 15 })
  .withMessage('Name length should be from 0 to 15 symbols');
const descriptionValidation = body('description')
  .notEmpty()
  .withMessage('Description field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 500 })
  .withMessage('Description length should be from 0 to 500 symbols');
const websiteUrlValidation = body('websiteUrl')
    .notEmpty()
    .withMessage('websiteUrl field is required.')
    .isString()
    .trim()
    .isLength({ max: 100 })
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Invalid URL format')

blogsRoutes.get('/', (req, res) => {
  res.send(blogsRepository.findAllBlogs())
});
blogsRoutes.get('/:id', (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findBlog = blogsRepository.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
  }
  res.send(findBlog)
})
blogsRoutes.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, (req, res) => {
  res.status(201).send(blogsRepository.createBlog(req.body?.name, req.body?.description, req.body?.websiteUrl));
})
blogsRoutes.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  const findBlog = blogsRepository.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
  }
  const updatedBlog = blogsRepository.updateBlog(req.params.id, req.body)
  if (updatedBlog) {
    res.sendStatus(204);
  }
})
blogsRoutes.delete('/:id',authMiddleware, (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
  }
  if (blogsRepository.deleteBlog(req.params.id)) {
    res.send(204);
  }
  res.sendStatus(404);
})
