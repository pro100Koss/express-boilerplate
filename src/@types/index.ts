import {IUser} from '@/models/User';
import {CallbackValidator, RequestValidation} from './extendedValidator';

interface ValidatorFunction {
  (item: string | string[] | number, message?: any): CallbackValidator;

  (schema: Record<string, unknown>): CallbackValidator;
}

export interface Request extends Express.Request, RequestValidation {
  user: IUser;
  params: any;
  headers: any;
  body: any;
  query: any;
  get: (prop: string) => any;
  checkBody: ValidatorFunction;
}

export {Response} from 'express';
