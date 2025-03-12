import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedException implements ExceptionFilter {
  public catch(exception: { message: string }, host: ArgumentsHost): void {
    const res: Response = host.switchToHttp().getResponse();

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: exception.message,
    });
  }
}
