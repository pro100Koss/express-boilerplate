import {RequestValidation as RequestValidationOriginal, Validator as OriginalValidator} from 'express-validator';

export interface CallbackValidator extends OriginalValidator {
  custom: (value: any) => void;
}

interface ValidatorFunction {
  (item: string | string[] | number, message?: any): CallbackValidator;

  (schema: Record<string, unknown>): CallbackValidator;
}

export interface RequestValidation extends RequestValidationOriginal {
  checkBody: ValidatorFunction;
}
