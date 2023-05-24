import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PayLoad } from 'src/common/dto/global.dto';
import { EmailConfirmEntity } from 'src/common/entities/emailConfirm.entity';
import { PasswordConfirmEntity } from 'src/common/entities/passwordConfirm.entity';
import { Role } from 'src/common/entities/role.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(EmailConfirmEntity)
    private emailconfirmRepo: Repository<EmailConfirmEntity>,

    @InjectRepository(PasswordConfirmEntity)
    private passwordConfirmRepo: Repository<PasswordConfirmEntity>,

    private jwt: JwtService,
    private readonly sendEmailService: MailService,
  ) {}

  async findOneById(id: number) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    return user;
  }

  async findAll() {
    const users = await this.usersRepo.find();
    return users;
  }

  async delete(id: number) {
    const user = await this.findOneById(id);
    await this.usersRepo.remove(user);
    return user;
  }

  async update(id: number, data: any) {
    const user = await this.usersRepo.findOneById(id);
    Object.assign(user, data);
    return this.usersRepo.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: { email: email },
    });
    return user;
  }

  async createToken(payload: PayLoad) {
    const token = await this.jwt.sign(payload);
    return token;
  }

  async signUp(data: any) {
    const user = await this.findOneByEmail(data.email);
    if (user) {
      throw new BadRequestException('Email is exists');
    }
    const new_user = new User();
    new_user.email = data.email;
    new_user.password = data.password;
    new_user.firstName = data.firstName;
    new_user.lastName = data.lastName;
    await new_user.save();

    for (let i = 0; i < data.roles.length; i++) {
      const n_role = new Role();
      n_role.user = new_user;
      n_role.userId = new_user.id;
      n_role.role = data.roles[i];
      await n_role.save();
    }

    //tạo ra token_email
    await this.createTokenEmail(data.email);
    //send email to user
    await this.sendEmailVerifucation(data.email);

    // const parallelAsync = new ParallelAsync();
    // for (let i = 0; i < data.roles.length; i++) {
    //   parallelAsync.add(
    //     this.roleRepository.save({
    //       user: new_user,
    //       userId: new_user.id,
    //       role: data.roles[i],
    //     }),
    //   );
    // }
    // await parallelAsync.done();

    return 'register success';
  }

  async signIn(data: any) {
    const { email, password } = data;
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    if (user.checkPassword(password) && user.verifiedEmail === true) {
      const payload = {
        email: email,
        id: user.id,
      };

      const token = await this.createToken(payload);
      const refresh_token = this.jwt.sign({
        payload,
        secret: 'secretStringThatNoOneCanGuess',
        signOptions: {
          algorithm: 'HS512',
          expiresIn: '3d',
        },
      });
      user.refresh_token = refresh_token;
      await user.save();
      return {
        token,
        user,
      };
    }
  }

  async signInAdmin(data: any) {
    const { email, password } = data;
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .addSelect('user.password')
      .where('user.email = :email', { email: email })
      .getOne();
    console.log('user:', user);
    if (!user) {
      throw new NotFoundException('User does not exist in the database');
    }
    if (user && this.checkRoleAdmin(user.roles)) {
      if (user.checkPassword(password) && user.verifiedEmail === true) {
        const payload = {
          email: email,
          id: user.id,
        };
        const token = await this.jwt.signAsync(payload);
        const refresh_token = await this.jwt.signAsync({
          payload,
          secret: 'secretStringThatNoOneCanGuess',
          signOptions: {
            algorithm: 'HS512',
            expiresIn: '3d',
          },
        });
        user.refresh_token = refresh_token;
        await user.save();
        return {
          token,
          user,
        };
      } else {
        throw new BadRequestException('check your password');
      }
    } else {
      throw new UnauthorizedException();
    }
  }
  async createTokenEmail(email: string) {
    const user_confirm = await this.emailconfirmRepo.findOne({
      where: { email },
    });
    if (
      user_confirm &&
      (new Date().getTime() - user_confirm.timestamp.getTime()) / 60000 < 15
    ) {
      await user_confirm.remove();
      throw new ConflictException('Check Your Email');
    } else {
      const user_confirm_email = new EmailConfirmEntity();
      user_confirm_email.email = email;
      user_confirm_email.token_email = Math.floor(
        Math.random() * 99999 + 1000,
      ).toString();
      user_confirm_email.timestamp = new Date();
      await user_confirm_email.save();
    }
  }

  async sendEmailVerifucation(email: string) {
    const verifiedEmail = await this.emailconfirmRepo.findOne({
      where: { email },
    });
    if (verifiedEmail && verifiedEmail.token_email) {
      const url = `<a style='text-decoration:none;'
      href= http://localhost:3000/auth/verified-email/${verifiedEmail.token_email}>Click Here to confirm your email</a>`;
      return await this.sendEmailService.sendEmailConfirmation(email, url);
    }
  }

  async verifiedActionConfirmEmail(token_email: string) {
    const user_confirm = await this.emailconfirmRepo.findOne({
      where: {
        token_email,
      },
    });
    if (user_confirm) {
      const user = await this.findOneByEmail(user_confirm.email);
      user.verifiedEmail = true;
      await user.save();
      await user_confirm.remove();
      return 'confirm success';
    }
  }
  //forgot password
  async forgotPassword(email: string) {
    //create token password
    const invalidForgotassword = await this.passwordConfirmRepo.findOne({
      where: {
        email,
      },
    });
    if (
      invalidForgotassword &&
      (new Date().getTime() - invalidForgotassword.timestamp.getTime()) /
        60000 <
        15
    ) {
      throw new HttpException(
        'PASSWORD_RESET_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const new_forgotPassword = new PasswordConfirmEntity();
      new_forgotPassword.email = email;
      new_forgotPassword.timestamp = new Date();
      new_forgotPassword.token_password = Math.floor(
        Math.random() * 999999,
      ).toString();
      await new_forgotPassword.save();
      //send email
      await this.sendEmailForgotPassword(email);
      return 'send forgot password okale!';
    }
  }
  async sendEmailForgotPassword(email: string) {
    const user = await this.findOneByEmail(email);
    const invalidForgotassword = await this.passwordConfirmRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('user do not exists');
    }
    if (invalidForgotassword && invalidForgotassword.token_password) {
      const url = `<a style='text-decoration:none;'
      href= http://localhost:3000/auth/forgot-password/${invalidForgotassword.token_password}>Click Here to change your password</a>`;
      await this.sendEmailService.sendEmailForgotPassword(email, url);
      return 'send forgot password okela';
    }
  }

  async checkPassword(email: string, password: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) {
      throw new HttpException('User Does not Found', HttpStatus.NOT_FOUND);
    }
    const check = await bcrypt.compareSync(password, user.password);
    delete user.password;
    return check;
  }
  async hassPass(password: string) {
    return await bcrypt.hashSync(password, 10);
  }
  //set new password
  async setPassword(email: string, newPassword: string) {
    const user = await this.usersRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException('LOGIN_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    user.password = await this.hassPass(newPassword);
    await user.save();
    return true;
  }
  //set new Password
  async setNewPassword(resetPasswordDto: any) {
    let isNewPasswordChanged = false;
    const { email, token_password, currentPassword, newPassword } =
      resetPasswordDto;
    if (email && currentPassword) {
      const isValidPassword = await this.checkPassword(email, currentPassword);
      if (isValidPassword) {
        isNewPasswordChanged = await this.setPassword(email, newPassword);
      } else {
        throw new HttpException(
          'RESET_PASSWORD_WRONG_CURRENT_PASSWORD',
          HttpStatus.CONFLICT,
        );
      }
    } else if (token_password) {
      const forgottenPassword = await this.passwordConfirmRepo.findOne({
        where: {
          token_password: token_password,
        },
      });
      isNewPasswordChanged = await this.setPassword(
        forgottenPassword.email,
        newPassword,
      );
      if (isNewPasswordChanged) {
        await this.passwordConfirmRepo.delete(forgottenPassword.id);
      }
    } else {
      return new HttpException(
        'RESET_PASSWORD_CHANGE_PASSWORD_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return 'change okela';
  }
  //check role
  async checkRoleAdmin(roles: any) {
    for (let i = 0; i < roles.length; i++) {
      const rolename = roles[i].role;
      if (rolename === 'admin') {
        return true;
      } else {
        return false;
      }
    }
  }
}
