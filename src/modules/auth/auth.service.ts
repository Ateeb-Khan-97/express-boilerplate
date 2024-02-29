import db from '../../util/db.util';
import { Logger } from '../../util/logger.util';

import * as bcrypt from 'bcrypt';

class AuthService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(AuthService.name);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async findSessionByUserId(userId: number) {
    return db.session.findFirst({ where: { userId } });
  }

  async upsertByUserId(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    try {
      const session = await db.session.findUnique({ where: { userId } });
      if (!session) {
        return this.createSession(userId, accessToken, refreshToken);
      }
      return this.updateSession(userId, accessToken, refreshToken);
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  async createSession(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    try {
      await db.session.create({ data: { accessToken, refreshToken, userId } });
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  async updateSession(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    try {
      await db.session.update({
        data: { accessToken, refreshToken },
        where: { userId },
      });
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}

export const authService = new AuthService();
