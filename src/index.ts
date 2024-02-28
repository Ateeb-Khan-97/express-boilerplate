import express from 'express';

import { applicationModule } from './app.module';
import { Logger } from './util/logger.util';

import { APPLICATION_CONSTANTS } from './shared/constant/application.constant';

const app = express();
applicationModule(app);

app.listen(APPLICATION_CONSTANTS.PORT, () => {
  const logger = new Logger(APPLICATION_CONSTANTS.TAG);
  logger.log(APPLICATION_CONSTANTS.BOOTSTRAP_MESSAGE);
});
