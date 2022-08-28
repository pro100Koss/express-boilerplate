export const wrapAwait =
  (fn: any) =>
  (...args: any[]) =>
    fn(...args).catch(args[2]);

export default wrapAwait;
