import { User } from '@prisma/client';

export type Context<T = Record<string, any>> = {
  body: T;
  params: T;
  query: T;
  user: Omit<User, 'password'>;
};
