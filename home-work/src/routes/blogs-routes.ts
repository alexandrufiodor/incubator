import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { blogsServices } from '../domains/blogs-services';
import { contentValidation, shortDescriptionValidation, titleValidation } from './posts-routes';

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
  res.send(await blogsServices.findAllBlogs(req?.query?.pageSize?.toString() || '10', req?.query?.pageNumber?.toString() || '1', req?.query?.searchNameTerm?.toString() || null, req?.query?.sortBy?.toString() || 'createdAt', req?.query?.sortDirection?.toString() || 'desc'))
});
blogsRoutes.get('/:id', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
  }
  const findBlog = await blogsServices.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
    return;
  }
  res.send(findBlog)
})
blogsRoutes.get('/:id/posts', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const findBlog = await blogsServices.findBlogById(req.params.id);
  if (!findBlog) {
    res.sendStatus(404);
    return;
  }
  res.send(await blogsServices.findAllPostsByBlogId(req?.query?.pageSize?.toString() || '10', req?.query?.pageNumber?.toString() || '1', req?.query?.sortBy?.toString() || 'createdAt', req?.query?.sortDirection?.toString() || 'desc', req?.params?.id?.toString()))
});
blogsRoutes.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const newPost= await blogsServices.createPostByBlogId(req.body?.title, req.body?.shortDescription, req.body?.content, req?.params?.id?.toString());
  if (newPost) {
    res.status(201).send(newPost);
    return;
  }
  res.sendStatus(404);
})
blogsRoutes.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware,async (req, res) => {
  res.status(201).send(await blogsServices.createBlog(req.body?.name, req.body?.description, req.body?.websiteUrl));
})
blogsRoutes.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return
  }

  const updatedBlog = await blogsServices.updateBlog(req.params.id?.toString(), req.body)
  if (updatedBlog) {
    res.sendStatus(204);
    return;
  }
  res.sendStatus(404);
})
blogsRoutes.delete('/:id', authMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const deletedBlog = await blogsServices.deleteBlog(req.params.id?.toString());
  if (deletedBlog) {
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404);
})
