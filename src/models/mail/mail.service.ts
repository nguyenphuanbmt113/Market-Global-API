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

  async contract(email: string, message: string, title: string, name: string) {
    await this.mailerService.sendMail({
      from: name,
      to: email,
      subject: title,
      text: message,
      attachments: [
        {
          filename: 'image.jpg', // Tên tệp tin đính kèm
          path: 'https://images.unsplash.com/photo-1684513457686-088dcab96390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60', // Đường dẫn đến tệp tin đính kèm
          cid: 'unique-image-id', // ID duy nhất của hình ảnh để sử dụng trong thẻ <img> trong HTML
        },
      ],
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
