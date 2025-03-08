import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../types';
import { PermissionEntity } from './permission.entity';

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
  public name: Role = Role.Customer;

  @ManyToMany(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'roles_permissions' })
  public permissions!: PermissionEntity[];
}
