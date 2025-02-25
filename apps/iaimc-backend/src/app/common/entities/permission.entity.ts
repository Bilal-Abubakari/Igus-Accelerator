import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  name: string;
}
