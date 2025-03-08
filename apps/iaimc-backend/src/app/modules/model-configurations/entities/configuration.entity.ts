import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../common/entities/user.entity';
import { ReviewStatus } from '../../../common/types';
import { FileEntity } from './file.entity';
import { PrincipalFormEntity } from './principal-form.entity';

@Entity('model_configurations')
export class ModelConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public material!: string;

  @Column({ default: 1 })
  public quantity!: number;

  @Column()
  public lifeTime!: number;

  @OneToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  public file!: FileEntity;

  @OneToOne(() => PrincipalFormEntity)
  @JoinColumn()
  public principalForm!: PrincipalFormEntity;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.Unsubmitted,
  })
  public reviewStatus!: ReviewStatus;

  @OneToOne(() => UserEntity)
  public assignedUser!: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public user!: UserEntity;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
