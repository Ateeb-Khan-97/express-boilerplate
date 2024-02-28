import type { Context } from '../../shared/interface/application.interface';
import { Controller, Get } from '../../util/decorator.util';
import { Logger } from '../../util/logger.util';

@Controller('/auth')
export class AuthController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AuthController.name);
  }

  @Get()
  handler(c: Context) {
    return c;
  }
}
