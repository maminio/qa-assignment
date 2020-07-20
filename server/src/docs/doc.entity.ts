import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DocStatus } from './doc-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Doc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: DocStatus;

  @ManyToOne(type => User, user => user.docs, { eager: false })
  user: User;

  @Column()
  userId: number;

  @Column()
  file: string;

  @Column()
  result: string;
}
