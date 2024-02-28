import type { Context } from '../../shared/interface/application.interface';
import { Controller, Get, Post } from '../../util/decorator.util';
import { HttpStatus } from '../../util/http-status.util';

@Controller('/users')
export class UserController {
  @Get()
  getAllHandler(c: Context) {
    return null;
  }

  @Post()
  createUserHandler(c: Context) {
    return { status: HttpStatus.CREATED };
  }
}
