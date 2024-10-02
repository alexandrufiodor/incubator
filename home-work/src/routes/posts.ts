import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, authWithBarearTokenMiddleware, inputValidationMiddleware } from '../middlewares/middlewares';
import { blogsRepository } from '../repositories/blogs-repository';
import { postsServices } from '../domains/posts-services';
import { commentContentValidation } from './comments';

export const posts = Router();

export const titleValidation = body('title')
  .notEmpty()
  .withMessage('Title field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 30 })
  .withMessage('Title length should be from 0 to 30 symbols');
export const shortDescriptionValidation = body('shortDescription')
  .notEmpty()
  .withMessage('shortDescription field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 100 })
  .withMessage('shortDescription length should be from 0 to 100 symbols');
export const contentValidation = body('content')
  .notEmpty()
  .withMessage('content field is required.')
  .isString()
  .trim()
  .isLength({min: 1, max: 1000 })
  .withMessage('content length should be from 0 to 1000 symbols');
export const blogIdValidation = body('blogId')
  .notEmpty()
  .withMessage('blogId field is required.').custom(async (value) => {
    const blog = await blogsRepository.findBlogById(value);
    if (!blog) {
      return Promise.reject('Blog with this blogId does not exist');
    }
    return true
  })


posts.get('/', async (req, res) => {
  res.send(await postsServices.findAllPosts(req?.query?.pageSize?.toString() || '10', req?.query?.pageNumber?.toString() || '1', req?.query?.sortBy?.toString() || 'createdAt', req?.query?.sortDirection?.toString() || 'desc'))
});
posts.get('/:id', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const findPost = await postsServices.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
    return;
  }
  res.send(findPost)
})
posts.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, async (req, res) => {
  res.status(201).send(await postsServices.createPost(req.body?.title, req.body?.shortDescription, req.body?.content, req.body?.blogId));
})
posts.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const updatedPost = await postsServices.updatePost(req.params.id, req.body)
  if (updatedPost) {
    res.sendStatus(204);
    return;
  }
  res.sendStatus(404);
})
posts.delete('/:id', authMiddleware, async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return
  }
  const deletedPost = await postsServices.deletePost(req.params.id?.toString());
  if (deletedPost) {
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404);
})
posts.post('/:id/comments', authWithBarearTokenMiddleware, commentContentValidation, inputValidationMiddleware, async (req: any, res: any) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  if (req?.user) {
    const newPost= await postsServices.createCommentByPostId(req.body?.content, req?.params?.id?.toString(), req?.user);
    if (newPost) {
      res.status(201).send(newPost);
      return;
    } else {
      res.sendStatus(404);
      return;
    }
  }
  res.sendStatus(404);
})

posts.get('/:id/comments', async (req, res) => {
  if (!req?.params?.id) {
    res.sendStatus(404);
    return;
  }
  const findPost = await postsServices.findPostById(req.params.id);
  if (!findPost) {
    res.sendStatus(404);
    return;
  }
  res.send(await postsServices.findAllCommentsByPostId(req?.query?.pageSize?.toString() || '10', req?.query?.pageNumber?.toString() || '1', req?.query?.sortBy?.toString() || 'createdAt', req?.query?.sortDirection?.toString() || 'desc', req?.params?.id?.toString()))
});
