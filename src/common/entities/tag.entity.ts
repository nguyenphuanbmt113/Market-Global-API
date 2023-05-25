import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('tags')
@Unique(['name'])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: new Date(Date.now()),
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;
}
