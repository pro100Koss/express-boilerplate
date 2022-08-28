import {createServer} from 'http';
import express, {Request, Response, Application} from 'express';
import path from 'path';
import {Connection} from 'mongoose';
import {StorageAdapter, StorageTypes} from './libs/storage';
import eventEmitter, {EventEmitter} from '@/components/eventEmitter';
import {publicRouter, protectedRouter} from '@/router';
import errorHandleMiddleware from '@/middlewares/ErrorHandleMiddleware';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import onApplicationExit from '@/libs/OnApplicationExit';
import serveFavicon from 'serve-favicon';
import corsHeadersMiddleware from '@/middlewares/CorsHeadersMiddleware';
import {endpointNotFoundMiddleware} from '@/middlewares/EndpointNotFoundMiddleware';

import logger from '@/components/logger';
import session from '@/components/sessions';
import cron, {Cron} from '@/components/Cron';
import connectDatabase from '@/components/db';
import initMailer from '@/components/mailer';

import jobService from '@/services/JobService';
import bootstrapJobService from '@/services/BootstrapJobService';
import eventListenersService from '@/services/EventListenersService';
import settingsService from '@/services/SettingsService';

const engine = require('ejs-locals'),
  validator = require('express-validator'),
  jwtProtected = require('./middlewares/AuthMiddlewares').jwtProtected,
  jwtPublic = require('./middlewares/AuthMiddlewares').jwtPublic,
  cors = require('cors');

const PROJECT_ROOT = path.dirname(__dirname);

export class App {
  static requestLimit = '50mb';
  static appRoot: string = __dirname;

  app: Application;
  db: Connection;
  cron: Cron;
  storage: (storage?: StorageTypes) => StorageAdapter;
  eventEmitter: EventEmitter;

  constructor() {
    this.app = express();
    this.db = connectDatabase();
    this.cron = cron;
    this.eventEmitter = eventEmitter;
    this.storage = require('./components/storage').default;

    setImmediate(this.initialize);

    onApplicationExit(async () => {
      logger.info('Shutting down...');
      await jobService.stopCurrentJobExecution();
    });
  }

  protected initialize = async () => {
    const app = this.app;

    await this.initializeServices();

    // set views configs
    app.engine('ejs', engine);
    app.set('views', App.appRoot + '/views');
    app.set('view engine', 'ejs');

    // register app components
    initMailer(this.app);
    cron.run();

    app.all('*', corsHeadersMiddleware);

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true, limit: App.requestLimit}));
    app.use(bodyParser.json({limit: App.requestLimit}));
    app.use(session);
    app.use(cors());
    app.use(validator());

    //define static files
    app.use('/static/images', express.static('static/images'));
    app.use(serveFavicon(path.join(PROJECT_ROOT, 'static', 'favicon.ico')));

    //request logger
    app.use((req: Request, res: Response, next: any) => {
      logger.info(`${req.method.toUpperCase()}: ${req.headers.host}${req.originalUrl}`);
      next();
    });

    // auth
    app.use('/', jwtPublic);

    // load user needed
    app.use(require('./middlewares/AuthMiddlewares').loadUser);

    // register public routes
    app.use('/', publicRouter);

    // protect other routes
    app.use('/', jwtProtected);
    app.use('/', require('./middlewares/AuthMiddlewares').checkUser);
    app.use('/', protectedRouter);

    // handle 404 and errors
    app.use(endpointNotFoundMiddleware);
    app.use(errorHandleMiddleware);
  };

  run(port: number) {
    const server = createServer(this.app);

    server.listen(port);
  }

  private async initializeServices() {
    eventListenersService.init(this.app);

    await settingsService.load().catch((error) => {
      logger.error(`Failed to load settings: ${error}`);
    });

    await bootstrapJobService.execute().catch((err) => {
      logger.error(`failed to execute bootstrap job: ${err}`);
    });
  }
}

const app = new App();
export default app;
