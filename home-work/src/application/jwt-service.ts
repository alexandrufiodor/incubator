//@ts-ignore
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
export const jwtSecret = '1234567890'

export const jwtService = {
  async createJWT(user: any, expiresIn = '10s') {
    return jwt.sign({userId: user.id}, jwtSecret, {expiresIn})
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, jwtSecret);
      if (!result) {
        return null;
      }
      return (new ObjectId(result?.userId)).toString();
    } catch (error) {
      return null
    }
  },
}
