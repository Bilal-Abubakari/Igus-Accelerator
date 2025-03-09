import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../types/general.types';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Customer,
    unique: true,
  })
  public name!: Role;
}
