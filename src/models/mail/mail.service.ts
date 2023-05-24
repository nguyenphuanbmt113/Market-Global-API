import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(email: string, url: any) {
    await this.mailerService.sendMail({
      from: 'My Compomy',
      to: email,
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `<h1>Hi User</h1> <br><br> <h2>Thanks for your registration</h2>
<h3>Please Verify Your Email by clicking the following link</h3><br><br>
        ${url}`,
    });
  }

  async sendEmailForgotPassword(email: string, url: any) {
    await this.mailerService.sendMail({
      from: 'My Compomy',
      to: email,
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `<h1>Hi User</h1> <br><br> <h2>Thanks for your request</h2>
<h3>Please Verify Your Email by clicking the following link</h3><br><br>
        ${url}`,
    });
  }
}
