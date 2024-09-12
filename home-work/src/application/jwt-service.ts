import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
const jwtSecret = '1234567890'

export const jwtService = {
  async createJWT(user: any) {
    return jwt.sign({userId: user.id}, jwtSecret, {expiresIn: '1h'})
  },
  async getUserIdByToken  (token: string) {
    try {
      const result: any = jwt.verify(token, jwtSecret);
      console.log('result', result);
      return (new ObjectId(result?.userId)).toString();
    } catch (error) {
      return null
    }
  }
}
