import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { blogsDbRepository } from '../repositories/blogs-db-repository';

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

blogsRoutes.get('/', async (req, res) => {
  res.send(await blogsDbRepository.findAllBlogs())
});
blogsRoutes.get('/:id', async (req, res) => {
  console.log('test', req?.params?.id);
  if (!req?.params?.id) {
    res.sendStatus(404);
  }
  const findBlog = await blogsDbRepository.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
    return;
  }
  res.send(findBlog)
})
blogsRoutes.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware,async (req, res) => {
  res.status(201).send(await blogsDbRepository.createBlog(req.body?.name, req.body?.description, req.body?.websiteUrl));
})
blogsRoutes.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return
  }
  const findBlog = await blogsDbRepository.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
    return
  }
  const updatedBlog = await blogsDbRepository.updateBlog(req.params.id, req.body)
  if (updatedBlog) {
    res.sendStatus(204);
  }
})
blogsRoutes.delete('/:id',authMiddleware, async (req, res) => {
  if (!req.params.id) {
    res.sendStatus(404);
    return
  }
  if (await blogsDbRepository.deleteBlog(req.params.id)) {
    res.sendStatus(204);
    return
  }
  res.sendStatus(404);
})
