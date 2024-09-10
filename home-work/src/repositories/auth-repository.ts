import { usersRepository } from './users-repository';
import { comparePassword } from '../utils/utils';

export const authRepository = {
  async findUserByLoginOrEmail(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return false;
    }
    return await comparePassword( password, user.password);
  },
}


