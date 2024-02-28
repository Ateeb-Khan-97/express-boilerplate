import { ENV } from '../../util/env.util';

export const APPLICATION_CONSTANTS = {
  PORT: ENV.PORT,
  TAG: 'Application',
  BOOTSTRAP_MESSAGE: `Application running at http://localhost:${ENV.PORT}`,
  ROUTE_ERROR: 'Error initializing routes',
  BASE: '/api',
} as const;
