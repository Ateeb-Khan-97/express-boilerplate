import db from '../../util/db.util';
import { Logger } from '../../util/logger.util';

class AuthService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(AuthService.name);
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
      const session = await db.session.findUnique({
        where: { userId },
        select: { accessToken: true, refreshToken: true },
      });
      if (!session)
        return this.createSession(userId, accessToken, refreshToken);

      session['accessToken'] = accessToken;
      session['refreshToken'] = refreshToken;

      return db.session.update({ data: session, where: { userId } });
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
}

export const authService = new AuthService();
