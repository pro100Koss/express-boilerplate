import logger from '@/components/logger';
import {IBootstrapJob} from '@/types/IBootstrapJob';

export class ExampleBootstrapJob implements IBootstrapJob {
  isAllowExecute = () => true;

  execute = async () => {
    logger.info('Hello world from bootstrap job');
  };
}
