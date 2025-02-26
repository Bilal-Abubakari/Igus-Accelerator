import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public ping(): string {
    return 'Service is up and running';
  }
}
