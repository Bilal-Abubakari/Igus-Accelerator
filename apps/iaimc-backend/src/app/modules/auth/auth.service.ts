import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';
import { ENV } from '../../common/constants';
import { JwtUserPayload } from '../../common/types/general.types';
import { Request, Response } from 'express';

type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getAnonymousUserTokens(res: Response): Promise<void> {
    const anonymousUserId = uuidV4();
    const { accessToken, refreshToken } =
      await this.generateTokens(anonymousUserId);
    this.setRefreshTokenCookie(res, refreshToken);
    res.status(HttpStatus.OK).json({ accessToken });
  }

  public async refreshAccessTokens(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
      return;
    }

    try {
      const { id } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get(ENV.JWT_SECRET),
      });

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(id);
      this.setRefreshTokenCookie(res, newRefreshToken);
      res.status(HttpStatus.OK).json({ accessToken: accessToken });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  public async generateTokens(
    userId: string,
    anonymous = true,
  ): Promise<JwtTokens> {
    const payload: JwtUserPayload = {
      id: userId,
      anonymous,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get(ENV.JWT_SECRET),
      expiresIn: this.configService.get(ENV.ACCESS_TOKEN_EXPIRATION_TIME),
    });

    const refreshToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.get(ENV.JWT_SECRET),
        expiresIn: this.configService.get(ENV.REFRESH_TOKEN_EXPIRATION_TIME),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      path: '/auth/refresh',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
