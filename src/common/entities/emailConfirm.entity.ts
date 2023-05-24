import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';

@Entity()
@Unique(['email', 'token_email'])
export class EmailConfirmEntity extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token_email: string;

  @Column()
  timestamp: Date;
}
