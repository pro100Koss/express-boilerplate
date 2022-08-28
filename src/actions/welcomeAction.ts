import {Request, Response} from '@/@types';

const packageJson = require('../../package.json');

const welcomeAction = async (req: Request, res: Response): Promise<Response> =>
  res.send({message: `Welcome to express boilerplate project ${packageJson.version}`});

export {welcomeAction};
