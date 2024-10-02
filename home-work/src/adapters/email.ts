import { createTransport } from 'nodemailer';
type SendEmailType = {
  email: string;
  message: string;
  subject: string;
}

export const emailAdapter = {
  async sendEmail({ email, message, subject }: SendEmailType) {
    let transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'alexandrufiodor95@gmail.com',
        pass: 'xjgm skrp cmwo xlqu',
      },
      secure: true,
    });


    await transporter.sendMail({
      from: 'alexandrufiodor95@gmail.com',
      to: email,
      subject,
      html: message
    })
  }
}
