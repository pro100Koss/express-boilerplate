enum JobLogType {
  INFO = 'info',
  DEBUG = 'debug',
  ERROR = 'error',
}

type JobLogMessage = {
  timestamp: number;
  type: JobLogType;
  message: string;
};

export class JobLog {
  protected messages: JobLogMessage[] = [];

  protected add(type: JobLogType, message: string) {
    this.messages.push({
      timestamp: Date.now(),
      type,
      message,
    });
  }

  info = (message: string): void => {
    this.add(JobLogType.INFO, message);
  };

  error = (message: string): void => {
    this.add(JobLogType.ERROR, message);
  };

  debug(variable: any, title: string) {
    this.add(JobLogType.DEBUG, (title ? title + ': ' : '') + JSON.stringify(variable, null, 4));
  }

  toString = (): string =>
    this.messages
      .map(({timestamp, type, message}) => {
        const date = new Date(timestamp);
        return `${date.toLocaleString()} [${type.toUpperCase()}] ::: ${message}`;
      })
      .join('\r\n');
}
