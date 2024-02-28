import { ErrorRequestHandler } from 'express';
import { HttpException } from '../util/exception.util';
import { ZodError } from 'zod';
import { Response } from '../mappers/response.mapper';
import { HttpStatus } from '../util/http-status.util';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const response = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.INTERNAL_SERVER_ERROR_MESSAGE,
  };

  if (err instanceof HttpException) {
    response.message = err.message;
    response.status = err.status;
  }

  if (err instanceof ZodError) {
    response.status = HttpStatus.BAD_REQUEST;
    response.message = `${err.issues[0]?.path[0]} ${err.issues[0]?.message}`;
  }

  if (err.message) response.message = err.message;
  return Response.map({ res, response });
};
