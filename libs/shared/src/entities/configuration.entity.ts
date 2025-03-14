import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { MaterialName } from '../types/material.types';
import { UserEntity } from './user.entity';
import { ReviewStatus } from '../types/model-configuration.types';

@Entity('model_configurations')
export class ModelConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  public material!: MaterialName;

  @Column({ default: 1 })
  public quantity!: number;

  @Column('int', { nullable: true })
  public lifeTime?: number | null;

  @OneToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  public file!: FileEntity;

  @Column({ nullable: true })
  public snapshot?: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.Uploaded,
  })
  public reviewStatus!: ReviewStatus;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinTable()
  public assignedUser?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public user?: UserEntity;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
