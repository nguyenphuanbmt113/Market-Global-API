import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
@Unique(['email', 'token_password'])
export class PasswordConfirmEntity extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token_password: string;

  @Column()
  timestamp: Date;
}
