import { commonService } from '../../shared/common.service';
import type { Context } from '../../shared/interface/application.interface';
import { Controller, Get } from '../../util/decorator.util';
import { userService } from './user.service';

@Controller('/users')
export class UserController {
  @Get()
  async getAllHandler(c: Context) {
    const users = await userService.findAll();
    return users.map((each) => commonService.exclude(each, ['password']));
  }
}
