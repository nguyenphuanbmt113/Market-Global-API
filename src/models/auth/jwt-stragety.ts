import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretStringThatNoOneCanGuess',
    });
  }

  async validate(payload: any, req: Request) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user;
    return req.user;
  }
}
