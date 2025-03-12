import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  public name?: string;

  @Column('varchar', {
    unique: true,
    length: 255,
  })
  public email!: string;

  @Column({ nullable: true })
  public password?: string;

  @ManyToMany(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'users_roles' })
  public roles!: RoleEntity[];

  @OneToMany(() => ModelConfigurationEntity, (modelConfig) => modelConfig.user)
  public modelConfigurations!: ModelConfigurationEntity[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
