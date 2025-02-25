import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../common/entities/user.entity';
import { ContactEntity } from '../common/entities/contact.entity';
import { FileEntity } from '../common/entities/file.entity';
import { ModelConfigurationEntity } from '../common/entities/model-configuration.entity';
import { PermissionEntity } from '../common/entities/permission.entity';
import { PrincipalFormEntity } from '../common/entities/principal-form.entity';
import { RatingEntity } from '../common/entities/rating.entity';
import { RoleEntity } from '../common/entities/role.entity';

export const getPostgresConfig = (configService: ConfigService) => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: parseInt(configService.get('POSTGRES_PORT')!),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [
      ContactEntity,
      FileEntity,
      ModelConfigurationEntity,
      PermissionEntity,
      PrincipalFormEntity,
      RatingEntity,
      RoleEntity,
      UserEntity,
    ],
    url: configService.get('POSTGRES_DATABASE_URL'),
    synchronize: configService.get('NODE_ENV') === 'development',
  } as TypeOrmModuleOptions;
};
