import { Controller, Get, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_THROTTLE_TTL } from '../../common/constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('anonymous')
  public async getAnonymousTokens(@Res() res: Response): Promise<void> {
    await this.authService.getAnonymousUserTokens(res);
  }

  @Throttle({ default: { limit: 1, ttl: REFRESH_TOKEN_THROTTLE_TTL } })
  @Get('refresh')
  public async acquireNewTokens(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.refreshAccessTokens(req, res);
  }
}
