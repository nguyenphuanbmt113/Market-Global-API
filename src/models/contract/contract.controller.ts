import { Body, Controller, Post } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contract')
export class ContractController {
  constructor(private contactService: ContractService) {}
  @Post('')
  newMail(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    this.contactService.mailing(name, email, title, message);
  }
}
