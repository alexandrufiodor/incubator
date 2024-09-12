import { commentsRepository, CommentType } from '../repositories/comments-repository';
import { verifyId } from '../utils/utils';

export const commentsService = {
  async findCommentById(id: string): Promise<CommentType | null> {
    if (verifyId(id)) {
      return await commentsRepository.findCommentById(id);
    }
    return null;
  },
  async updateCommentById(id: string, content: string): Promise<CommentType | null> {
    if (verifyId(id)) {
      const existingComment = await commentsRepository.findCommentById(id);
      if (existingComment) {
        const updatedComment: CommentType = {
          createdAt: existingComment?.createdAt,
          commentatorInfo: {
            userId: existingComment?.commentatorInfo?.userId,
            userLogin: existingComment?.commentatorInfo?.userLogin,
          },
          content
        };
        return await commentsRepository.updateComment(id, updatedComment);
      }
    }
    return null;
  },
  deleteComment(id: string): Promise<boolean> | boolean {
    if (verifyId(id)) {
      return commentsRepository.deleteComment(id);
    }
    return false;
  },
  async deleteAllComments(): Promise<boolean> {
    return await commentsRepository.deleteAllComments()
  }
}
