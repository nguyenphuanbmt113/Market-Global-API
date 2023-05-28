import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContractService {
  constructor(private readonly nodeMailerService: MailService) {}

  async mailing(name: string, email: string, title: string, message: string) {
    await this.nodeMailerService.contract(email, message, title, name);
    return 'Contract okela';
  }
}
