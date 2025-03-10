import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../configurations/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register(jwtConfig().jwtOptions)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
