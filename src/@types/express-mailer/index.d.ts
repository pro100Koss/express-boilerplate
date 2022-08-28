declare module 'express-mailer' {
  import {Application} from 'express';

  export function extend(app: Application, config: any): void;
}
