import { Handler } from 'express';
import { NotFoundException } from '../util/exception.util';

export const notfoundMiddleware: Handler = (req, res) => {
  throw new NotFoundException();
};
