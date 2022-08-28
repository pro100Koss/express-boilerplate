import logger from '@/components/logger';
import {ExampleBootstrapJob} from '@/jobs/bootstrap/ExampleBootstrapJob';
import {IBootstrapJob} from '@/types/IBootstrapJob';

const bootstrapJobs: IBootstrapJob[] = [new ExampleBootstrapJob()];

export class BootstrapJobService {
  execute = async () => {
    for (const job of bootstrapJobs) {
      const jobName = job.constructor.name;

      if (job.isAllowExecute()) {
        const jobName = job.constructor.name;
        logger.info(`Executing bootstrap job: ${jobName}`);
        try {
          await job.execute();
        } catch (e) {
          logger.error(`Failed to execute job ${jobName}: ${e}`);
          console.error(e);
        }
      } else {
        logger.info(`Executing bootstrap job: ${jobName}... skipped`);
      }
    }
  };
}

const bootstrapJobService = new BootstrapJobService();
export default bootstrapJobService;
