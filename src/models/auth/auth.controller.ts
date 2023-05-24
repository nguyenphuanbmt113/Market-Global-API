import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Transactional()
  @Post('sign-up')
  async createAccount(@Body() createUserDto: any) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  async signIn(@Body() data: any) {
    return await this.authService.signIn(data);
  }

  @Post('sign-in-admin')
  async signInAdmin(@Body() data: any) {
    return await this.authService.signInAdmin(data);
  }

  @Get('verified-email/:token_email')
  async verifiedActionConfirmEmail(@Param('token_email') token_email: string) {
    return await this.authService.verifiedActionConfirmEmail(token_email);
  }

  @Get('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @Get('')
  async findAll() {
    return await this.authService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.authService.findOneById(id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    return await this.authService.findOneByEmail(email);
  }

  @Post('change-password')
  async setNewPassword(@Body() data: any) {
    return await this.authService.setNewPassword(data);
  }
}
