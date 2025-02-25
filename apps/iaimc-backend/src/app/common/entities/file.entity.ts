import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'step' })
  type: string;

  @Column()
  uploadDate: Date;

  // ToDo: Add model analysis results columns
}
