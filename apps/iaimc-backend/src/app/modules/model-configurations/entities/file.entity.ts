import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public type!: string;

  @Column({ type: 'text' })
  public url!: string;

  @Column({ type: 'text' })
  public checksum!: string;

  @Column({ type: 'varchar', length: 50 })
  public assetFolder!: string;

  @Column({ type: 'timestamp' })
  public uploadDate!: Date;

  // To do: Add model analysis results columns. They'll be worked out during model analysis...
}
