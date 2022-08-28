import {NextFunction, Request, Response} from 'express';

const corsHeadersMiddleware = function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

export default corsHeadersMiddleware;
