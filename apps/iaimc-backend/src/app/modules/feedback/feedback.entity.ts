import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public rating!: number;

  @Column({ nullable: true, type: 'text' })
  public comment!: string;

  @Column({ nullable: true })
  public email!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;
}
