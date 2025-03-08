import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Accepted3DModelType } from '../../../common/types';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column({ type: 'enum', enum: Accepted3DModelType })
  public type!: Accepted3DModelType;

  @Column({ type: 'text' })
  public url!: string;

  @Column({ type: 'varchar', length: 50 })
  public assetFolder!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  // To do: Add model analysis results columns. They'll be worked out during model analysis...
}
