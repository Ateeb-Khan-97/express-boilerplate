import { AuthController } from '../modules/auth/auth.controller';
import { UserController } from '../modules/user/user.controller';

/** Import all your controllers here */
export const controllers = [AuthController, UserController] as any[];
