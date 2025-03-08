import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  public name!: string;
}
