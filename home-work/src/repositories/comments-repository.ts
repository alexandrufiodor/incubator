import { clientDB } from './db';
import { ObjectId } from 'mongodb';

export type CommentType = {
  id?: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string,
  }
  createdAt: string
}

export const commentsCollection = clientDB.collection<CommentType>('comments');

export const commentsRepository = {
  async findCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    return {
      id: comment?._id?.toString(),
      content: comment?.content,
      commentatorInfo: comment?.commentatorInfo,
      createdAt: comment?.createdAt
    };
  },
  async updateComment(id: string, comment: Omit<CommentType, "id" | "createdAt">): Promise<CommentType | null> {
    const updatedComment: any = await commentsCollection.updateOne({ _id: new ObjectId(id) }, { "$set": { ...comment } })
    return updatedComment;
  },
  async deleteComment(id: string): Promise<boolean> {
    const deletedComment: any = await commentsCollection.deleteOne({  _id: new ObjectId(id) });
    return deletedComment?.deletedCount === 1;
  },
  async deleteAllComments(): Promise<boolean> {
    const deletedComments: any = await commentsCollection.deleteMany({});
    return deletedComments?.acknowledged;
  }
}
