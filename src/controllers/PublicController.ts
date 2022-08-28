import wrapAwait from '../wrapAwait';
import {Request, Response} from '@types';
import {Router} from 'express';
import eventEmitter from '@/components/eventEmitter';
import EventEmitterEvents from '@/types/EventEmitterEvents';

class WelcomeController {
  router = Router();

  constructor() {
    const router = this.router;

    router.get('/', wrapAwait(this.index));
  }

  index(req: Request, res: Response) {
    eventEmitter.emit(EventEmitterEvents.PUBLIC_ROUTE_OPENED);
    return res.send({msg: 'public action'});
  }
}

const welcomeController = new WelcomeController();
export default welcomeController;
