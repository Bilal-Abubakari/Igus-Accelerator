import { Controller, Get, Req, Res } from '@nestjs/common';
import { minutes, Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const REFRESH_TOKEN_TTL = minutes(14);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('anonymous')
  public async getAnonymousTokens(@Res() res: Response): Promise<void> {
    await this.authService.getAnonymousUserTokens(res);
  }

  @Throttle({ default: { limit: 1, ttl: REFRESH_TOKEN_TTL } })
  @Get('refresh')
  public async acquireNewTokens(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.refreshAccessTokens(req, res);
  }
}
