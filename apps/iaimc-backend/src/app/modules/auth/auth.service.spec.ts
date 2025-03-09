import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { AuthService } from './auth.service';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Auth Service', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockResponse: () => Response = () => {
    const res = {} as Response;
    res.cookie = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest: () => Request = () => {
    const req = {} as Request;
    req.cookies = {};
    return req;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Anonymous User Tokens', () => {
    it('should generate tokens and set refresh token cookie', async () => {
      const res = mockResponse();
      const userId = 'test-user-id';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      (uuidV4 as jest.Mock).mockReturnValue(userId);
      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      await service.getAnonymousUserTokens(res);

      expect(uuidV4).toHaveBeenCalled();
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, {
        path: '/auth/refresh',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken });
    });
  });

  describe('refreshAccessTokens', () => {
    it('should return 401 if no refresh token is provided', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await service.refreshAccessTokens(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No refresh token provided',
      });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.cookies['refreshToken'] = 'invalid-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshAccessTokens(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should generate new tokens and set refresh token cookie', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const userId = 'test-user-id';
      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';

      req.cookies['refreshToken'] = 'valid-token';
      mockJwtService.verify.mockReturnValue({ id: userId });
      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      await service.refreshAccessTokens(req, res);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: undefined,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, {
        path: '/auth/refresh',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken });
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = 'test-user-id';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const tokens = await service.generateTokens(userId);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({ accessToken, refreshToken });
    });
  });

  describe('setRefreshTokenCookie', () => {
    it('should set the refresh token cookie', () => {
      const res = mockResponse();
      const refreshToken = 'refresh-token';

      service.setRefreshTokenCookie(res, refreshToken);

      expect(res.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, {
        path: '/auth/refresh',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    });
  });
});
