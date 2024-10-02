import { emailManagers } from '../managers/email-managers';

export const emailServices = {
  async sendEmailRecovery(user: any): Promise<any> {
    return await emailManagers.sendPasswordRecoveryMessage(user);
  }
}

