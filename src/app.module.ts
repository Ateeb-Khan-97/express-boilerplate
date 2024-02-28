import type { Express } from 'express';
import { Logger } from './util/logger.util';
import { APPLICATION_CONSTANTS } from './shared/constant/application.constant';
import { AuthController } from './modules/auth/auth.controller';
import { errorMiddleware } from './middlewares/error.middleware';
import { notfoundMiddleware } from './middlewares/not-found.middleware';

export function applicationModule(app: Express) {
  /** Import all your controllers here */
  const controllers = [AuthController] as any[];
  const logger = new Logger(APPLICATION_CONSTANTS.TAG);

  for (const Controller of controllers) {
    try {
      const controllerInstance = new Controller();
      if (controllerInstance.router)
        app.use(APPLICATION_CONSTANTS.BASE, controllerInstance.router);
    } catch (err) {
      logger.error(APPLICATION_CONSTANTS.ROUTE_ERROR);
      process.exit(1);
    }
  }

  app.use('*', notfoundMiddleware);
  app.use(errorMiddleware);
}
