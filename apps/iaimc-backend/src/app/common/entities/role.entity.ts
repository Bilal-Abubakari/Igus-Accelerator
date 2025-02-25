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
  id: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Customer,
    unique: true,
  })
  name: Role = Role.Customer;

  @ManyToMany(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'roles_permissions' })
  permissions: PermissionEntity[];
}
