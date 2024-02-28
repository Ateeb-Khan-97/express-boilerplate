import type { Context } from '../../shared/interface/application.interface';
import { Controller, Post } from '../../util/decorator.util';

@Controller('/auth')
export class AuthController {
  @Post('/sign-in')
  signInHandler(c: Context) {
    return c;
  }

  @Post('/sign-up')
  signUpHandler(c: Context) {
    return c.body;
  }

  @Post('/refresh')
  refreshHandler(c: Context) {
    return c.query;
  }
}
