import jsonWebToken from 'jsonwebtoken';

import { Logger } from '../util/logger.util';

class CommonService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(CommonService.name);
  }

  async jwtVerify(token: string, secret: string) {
    return jsonWebToken.verify(token, secret) as any;
  }

  async jwtSign(
    payload: any,
    secret: string,
    options?: jsonWebToken.SignOptions,
  ) {
    return jsonWebToken.sign(payload, secret, options);
  }

  exclude<T, Key extends keyof T>(obj: T, keys: Key[]): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(obj as any).filter(([key]) => !keys.includes(key as any)),
    ) as Omit<T, Key>;
  }
}

export const commonService = new CommonService();
