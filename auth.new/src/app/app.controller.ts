import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    // TODO: Implement security: see https://docs.nestjs.com/techniques/security
    @Get()
    root(): string {
      return 'Hello World!';
    }
}
