import { authRepository } from '../repositories/auth-repository';

export const authServices = {
  async authUser(loginOrEmail: string, password: string): Promise<boolean> {
    return await authRepository.findUserByLoginOrEmail(loginOrEmail,
      password);
  }
}
