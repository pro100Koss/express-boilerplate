import logger from '@/components/logger';
import {EventEmitter} from 'events';
import {EventEmitterListener} from '@/types/EventEmitterListener';
import {Application} from 'express';
import EventEmitterEvents from '@/types/EventEmitterEvents';

export default class PublicRouteListener implements EventEmitterListener {
  eventEmitter: EventEmitter;
  app: Application;

  constructor(eventEmitter: EventEmitter, app: Application) {
    this.eventEmitter = eventEmitter;
    this.app = app;
  }

  onPublicRouteOpened() {
    logger.info('somebody opened public route');
  }

  subscribe() {
    logger.info('PublicRoute Listener subscribed');
    this.eventEmitter.on(EventEmitterEvents.PUBLIC_ROUTE_OPENED, this.onPublicRouteOpened);
  }
}
