import { emailAdapter } from '../adapters/email';

export const emailManagers = {
  async sendPasswordRecoveryMessage(user: any): Promise<any> {
    return await emailAdapter.sendEmail(user)
  },
  async sendEmailConfirmationMessage(user: any): Promise<any> {
    return await emailAdapter.sendEmail(user)
  }
}
