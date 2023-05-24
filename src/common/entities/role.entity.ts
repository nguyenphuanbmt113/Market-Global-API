import { IsEnum } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { User } from './user.entity';

export enum UserRole {
  Guest = 'guest',
  Host = 'host',
  Admin = 'admin',
}

@Entity()
export class Role extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  userId: number;
}
