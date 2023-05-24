import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class ItemTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
