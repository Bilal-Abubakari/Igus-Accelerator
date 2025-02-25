import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewStatus } from '../types';
import { FileEntity } from './file.entity';

@Entity('model_configurations')
export class ModelConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  material: string;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: ReviewStatus, default: 'Unsubmitted' })
  reviewStatus: ReviewStatus;

  @OneToOne(() => FileEntity)
  @JoinColumn()
  file: FileEntity;
}
