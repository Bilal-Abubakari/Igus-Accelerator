import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { ModelConfigurationEntity } from './model-configuration.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  name?: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @ManyToMany(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'users_roles' })
  roles: RoleEntity[];

  @ManyToMany(() => ModelConfigurationEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'users_model_configurations' })
  modelConfigurations: ModelConfigurationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
