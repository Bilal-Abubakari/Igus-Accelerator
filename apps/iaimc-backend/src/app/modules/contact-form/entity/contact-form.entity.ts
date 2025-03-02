import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact_forms')
export class ContactFormEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;

  @Column()
  public email!: string;

  @Column()
  public company!: string;

  @Column()
  public postalCode!: string;

  @Column()
  public country!: string;

  @Column({ nullable: true })
  public telephone?: string;

  @Column({ type: 'text', nullable: true })
  public message?: string;

  @Column({ type: 'boolean', default: false })
  public agreement!: boolean;

  @Column({ nullable: true })
  public fileId!: string;

  @CreateDateColumn()
  public createdAt!: Date;
}
