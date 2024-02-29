import type { Context } from '../../shared/interface/application.interface';

import {
  BodyValidator,
  Controller,
  Post,
  Public,
} from '../../util/decorator.util';
import { commonService } from '../../shared/common.service';
import { userService } from '../user/user.service';
import { AUTH_MESSAGES } from './auth.constant';

import {
  BadRequestException,
  NotFoundException,
} from '../../util/exception.util';
import {
  RefreshTokenDto,
  RefreshTokenSchema,
  SignInDto,
  SignInSchema,
  SignUpDto,
  SignUpSchema,
} from './auth.schema';
import { ENV } from '../../util/env.util';
import { HttpStatus } from '../../util/http-status.util';

@Controller('/auth')
export class AuthController {
  @Public()
  @Post('/sign-in')
  @BodyValidator(SignInSchema)
  async signInHandler({ body }: Context<SignInDto>) {
    const user = await userService.findOneUnique({ email: body.email });

    if (!user) throw new NotFoundException(AUTH_MESSAGES.NOT_FOUND);
    if (user.password != body.password)
      throw new BadRequestException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const payload = commonService.exclude(user, ['password']);

    const accessToken = await commonService.jwtSign(
      payload,
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.JWT_ACCESS_EXP },
    );
    const refreshToken = await commonService.jwtSign(
      payload,
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXP },
    );

    return {
      user: payload,
      accessToken,
      refreshToken,
    };
  }

  @Public()
  @Post('/sign-up')
  @BodyValidator(SignUpSchema)
  async signUpHandler({ body }: Context<SignUpDto>) {
    const user = await userService.findOneUnique({ email: body.email });
    if (user) throw new BadRequestException(AUTH_MESSAGES.ALREADY_EXISTS);

    await userService.create(body);

    return { status: HttpStatus.CREATED, message: AUTH_MESSAGES.REGISTERED };
  }

  @Public()
  @Post('/refresh')
  @BodyValidator(RefreshTokenSchema)
  async refreshHandler({ body }: Context<RefreshTokenDto>) {
    const user = await commonService.jwtVerify(
      body.refreshToken,
      ENV.JWT_REFRESH_SECRET,
    );

    if (user.exp) delete user.exp;
    if (user.iat) delete user.iat;

    const accessToken = await commonService.jwtSign(
      user,
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.JWT_ACCESS_EXP },
    );
    const refreshToken = await commonService.jwtSign(
      user,
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXP },
    );

    return { user, accessToken, refreshToken };
  }
}
