import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;
}
