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
import { authService } from './auth.service';

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

    await authService.upsertByUserId(user.id, accessToken, refreshToken);

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

    const session = await authService.findSessionByUserId(user.id);
    if (!session) throw new NotFoundException(AUTH_MESSAGES.SESSION_NOT_FOUND);
    if (session.refreshToken != body.refreshToken)
      throw new NotFoundException(AUTH_MESSAGES.REFRESH_TOKEN_NOT_MATCH);

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

    await authService.updateSession(user.id, accessToken, refreshToken);
    return { user, accessToken, refreshToken };
  }
}
