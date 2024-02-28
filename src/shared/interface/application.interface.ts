export type Context<T = Record<string, any>> = {
  body: T;
  params: T;
  query: T;
};
