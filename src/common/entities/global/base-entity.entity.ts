import { BaseEntity, CreateDateColumn, Entity } from 'typeorm';

@Entity()
class BaseClassEntity extends BaseEntity {
  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  updatedAt: Date;
}

export default BaseClassEntity;
