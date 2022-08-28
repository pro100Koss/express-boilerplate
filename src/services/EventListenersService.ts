import {Application} from 'express';
import PublicRouteListener from '@/components/listeners/PublicRouteListener';
import eventEmitter from '@/components/eventEmitter';

const LISTENERS = [PublicRouteListener];

export class EventListenersService {
  protected app: Application | null = null;

  init(app: Application) {
    this.app = app;

    for (const listener of LISTENERS) {
      new listener(eventEmitter, app).subscribe();
    }
  }
}

const eventListenersService = new EventListenersService();
export default eventListenersService;
