import winston, {transports, format} from 'winston';

const packageJson = require('../../package.json');
const level = process.env.LOG_LEVEL || 'debug';

const errorStack = format((info: any) => {
  if (info.stack) {
    info.message = info.stack;
  }

  return info;
});

const enumerateErrorFormat = format((info: any) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message,
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

const options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `logs/app.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880 * 4, // 5MB
    maxFiles: 100,
    colorize: false,
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `logs/error.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: false,
  },
  console: {
    level,
    handleExceptions: true,
    format: format.combine(errorStack(), format.cli()),
  },
  sentry: {
    handleExceptions: true,
    sentry: {
      dsn: process.env.SENTRY_DNS,
      version: packageJson.version,
    },
    level: 'warn',
  },
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: format.combine(enumerateErrorFormat(), format.timestamp(), format.json()),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file),
    new transports.File(options.errorFile),
  ],
  exitOnError: false,
});

export default logger;
