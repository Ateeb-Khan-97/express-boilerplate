import type { Express } from 'express';
import { Logger } from './util/logger.util';
import { APPLICATION_CONSTANTS } from './shared/constant/application.constant';
import { errorMiddleware } from './middlewares/error.middleware';
import { notfoundMiddleware } from './middlewares/not-found.middleware';
import { controllers } from './util/controllers.util';

export function applicationModule(app: Express) {
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
