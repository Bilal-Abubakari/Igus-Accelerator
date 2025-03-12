import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('newsletter_subscribers')
export class NewsLetterSubscriberEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public firstName!: string;

  @Column({ unique: true })
  public email!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
