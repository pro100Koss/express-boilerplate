import {Request, Response} from '@types';
import {NextFunction, RequestHandler} from 'express';

const adminMiddleware = function (req: Request, res: Response, next: NextFunction) {
  if (req.user?.email !== 'admin@gmail.com') {
    res.status(403).send();
    return;
  }

  next();
} as unknown as RequestHandler;

export default adminMiddleware;
