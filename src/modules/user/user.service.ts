import db from '../../util/db.util';

import { Prisma } from '@prisma/client';
import { Logger } from '../../util/logger.util';

class UserService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UserService.name);
  }

  async findOneById(id: number, select?: Prisma.UserSelect) {
    return db.user.findUnique({ where: { id }, select });
  }

  async findOneUnique(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return db.user.findUnique({ where, select });
  }

  async findAll(args?: Prisma.UserFindManyArgs) {
    return db.user.findMany(args);
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await db.user.create({ data });
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}

export const userService = new UserService();
