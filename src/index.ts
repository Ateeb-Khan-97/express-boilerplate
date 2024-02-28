import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import { applicationModule } from './app.module';
import { Logger } from './util/logger.util';

import { APPLICATION_CONSTANTS } from './shared/constant/application.constant';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

applicationModule(app);

app.listen(APPLICATION_CONSTANTS.PORT, () => {
  const logger = new Logger(APPLICATION_CONSTANTS.TAG);
  logger.log(APPLICATION_CONSTANTS.BOOTSTRAP_MESSAGE);
});
