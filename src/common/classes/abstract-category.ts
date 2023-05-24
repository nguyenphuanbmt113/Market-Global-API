import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    default: new Date(Date.now()),
  })
  createdAt: Date;
  @Column({
    nullable: true,
  })
  updatedAt: Date;
}
