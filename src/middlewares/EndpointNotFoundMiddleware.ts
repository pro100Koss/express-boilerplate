import {Request, Response} from 'express';

export const endpointNotFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).send({message: 'Endpoint not found for current route'});
};
