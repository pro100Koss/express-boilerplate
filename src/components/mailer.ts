import mailer from 'express-mailer';
import {Application} from 'express';

const config = {
  from: process.env.MAILER_SENDER,
  host: process.env.MAILER_HOST,
  secureConnection: true, // use SSL
  port: process.env.MAILER_POST || 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: process.env.MAILER_AUTH_USER || '',
    pass: process.env.MAILER_AUTH_PASSWORD || '',
  },
};

const initMailer = (app: Application) => {
  mailer.extend(app, config);
};

export default initMailer;
