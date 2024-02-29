import type { Request } from 'express';
import { UnauthorizedException } from '../util/exception.util';
import { commonService } from '../shared/common.service';
import { ENV } from '../util/env.util';

export const protect = async (req: Request) => {
  const authorization: string | undefined = req.headers.authorization;

  if (!authorization) throw new UnauthorizedException();
  if (!authorization.startsWith('bearer')) throw new UnauthorizedException();

  const [, token] = authorization.split(' ');

  if (!token) throw new UnauthorizedException();

  try {
    const user = await commonService.jwtVerify(token, ENV.JWT_ACCESS_SECRET);

    if (user.iat) delete user.iat;
    if (user.exp) delete user.exp;

    return user;
  } catch (err) {
    throw new UnauthorizedException();
  }
};
