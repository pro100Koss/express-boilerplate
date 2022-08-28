export interface IBootstrapJob {
  isAllowExecute: () => boolean;
  execute: () => Promise<void>;
}
