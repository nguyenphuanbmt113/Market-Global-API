import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class ItemTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  tagId: number;
}
