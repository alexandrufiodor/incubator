//@ts-ignore
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
export const jwtSecret = '1234567890'

const tokenBlacklist = new Map<string, number>();
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

  blacklistToken(token: string) {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken) {
      const ttl = decodedToken.exp - Math.floor(Date.now() / 1000);
      tokenBlacklist.set(token, Date.now() + ttl * 1000);
    }
  },

  isTokenBlacklisted(token: string) {
    const expiry = tokenBlacklist.get(token);
    if (expiry && Date.now() < expiry) {
      return true;
    } else {
      // Clean up old tokens
      tokenBlacklist.delete(token);
      return false;
    }
  }
}
