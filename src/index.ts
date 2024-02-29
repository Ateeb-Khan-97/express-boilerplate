import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { Logger } from './util/logger.util';

import { APPLICATION_CONSTANTS } from './shared/constant/application.constant';
import { applicationModule } from './app.module';

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

applicationModule(app);

app.listen(APPLICATION_CONSTANTS.PORT, () => {
  const logger = new Logger(APPLICATION_CONSTANTS.TAG);
  logger.log(APPLICATION_CONSTANTS.BOOTSTRAP_MESSAGE);
});
