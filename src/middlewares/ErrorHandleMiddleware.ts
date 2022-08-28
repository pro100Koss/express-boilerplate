import logger from '@/components/logger';
import {Request, Response} from '@types';
import {RequestHandler} from 'express';

const errorHandleMiddleware = function (error: any, req: Request, res: Response) {
  if (error.name === 'UnauthorizedError') {
    return res.status(error.status).send({error: error.message});
  }

  logger.error(error);
  return res.status(500).send({error: 'Oops, something went wrong.'});
} as unknown as RequestHandler;

export default errorHandleMiddleware;
