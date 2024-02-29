import { Schema } from 'zod';
import { Logger } from './logger.util';
import { Router } from 'express';
import { APPLICATION_CONSTANTS } from '../shared/constant/application.constant';
import { Response } from '../mappers/response.mapper';
import { protect } from '../middlewares/auth.middleware';

interface IFuncType {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  value: Function;
  schema?: Schema;
  paramSchema?: Schema;
  querySchema?: Schema;
  public?: true;
}

export const ApiTag = (tag: string) => {
  return function (constructor: any) {
    constructor['tag'] = tag;
  };
};

const validateMetaData = (target: any) => {
  if (!target.constructor._routes) {
    target.constructor._routes = [];
  }
};

const filterMetadata = (
  funcs: PropertyDescriptor[],
  newFunction: PropertyDescriptor,
) => {
  const index = funcs.findIndex(
    (eachFunc) => eachFunc.value.name == newFunction.value.name,
  );

  if (index == -1) {
    funcs.push(newFunction);
  } else {
    funcs[index] = { ...funcs[index], ...newFunction };
  }
};

export const Controller = (base: string) => {
  const logger = new Logger(APPLICATION_CONSTANTS.TAG);

  return function (constructor: any) {
    logger.log(`${constructor.name} loaded`);
    const newConstructor = function (...args: any[]) {
      const result = Reflect.construct(constructor, args, newConstructor);
      const router = Router();

      if (result.logger) result.logger.title = constructor.name;

      for (const each of constructor._routes as IFuncType[]) {
        each.value = each.value.bind(result);
        router[each.method](`${base}${each.path}`, async (req, res, next) => {
          try {
            const context = {
              body: {},
              params: {},
              query: {},
              user: {},
            };
            if (!each.public) context['user'] = await protect(req);
            if (each.schema) context['body'] = each.schema.parse(req.body);
            if (each.paramSchema)
              context['params'] = each.paramSchema.parse(req.params);
            if (each.querySchema)
              context['query'] = each.querySchema.parse(req.query);

            let response = await each.value(context);
            if (response == undefined || response == null) response = {};
            return Response.map({ res, response });
          } catch (error) {
            next(error);
          }
        });
      }

      result['router'] = router;
      return result;
    };
    newConstructor.prototype = constructor.prototype;
    return newConstructor as any;
  };
};

export const ParamValidator = (schema: Schema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['paramSchema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Public = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['public'] = true;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const QueryValidator = (schema: Schema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['querySchema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const BodyValidator = (schema: Schema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['schema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Get = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'get';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Post = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'post';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Patch = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'patch';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Put = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'put';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Delete = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'delete';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};
