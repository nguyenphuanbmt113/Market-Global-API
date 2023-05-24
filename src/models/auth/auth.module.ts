import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmEntity } from 'src/common/entities/emailConfirm.entity';
import { PasswordConfirmEntity } from 'src/common/entities/passwordConfirm.entity';
import { Role } from 'src/common/entities/role.entity';
import { User } from 'src/common/entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-stragety';
@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      EmailConfirmEntity,
      PasswordConfirmEntity,
    ]),
    MailModule,
    ConfigModule,
    JwtModule.register({
      secret: 'secretStringThatNoOneCanGuess',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '1d',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
