const noop = () => {};

const onApplicationExit = (callback: () => void) => {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noop;
  process.on('applicationExit', callback);

  // do app specific cleaning before exiting
  process.on('exit', () => {
    console.log('exit');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.emit('applicationExit');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('SIGTERM', () => {
    process.exit();
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception...');
    console.error(err);
    process.exit(99);
  });
};

export default onApplicationExit;
