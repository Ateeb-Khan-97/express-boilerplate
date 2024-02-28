interface IHttpException {
  message: string;
  status: number;
}

export class HttpException extends Error implements IHttpException {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(message, 403);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'NOT_FOUND') {
    super(message, 404);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(message: string) {
    super(message, 405);
  }
}
