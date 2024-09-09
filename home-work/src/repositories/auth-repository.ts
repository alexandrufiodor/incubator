import { usersRepository } from './users-repository';

export const authRepository = {
  async findUserByLoginOrEmail(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return false;
    }
    return password==user.password;
  },
}


