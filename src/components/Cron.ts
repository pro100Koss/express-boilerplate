import logger from '@/components/logger';
import Job from '@/models/Job';
import {JobStatus} from '@/types/JobStatus';
import jobService from '@/services/JobService';
import cronInstance, {schedule} from 'node-cron';

type CronInstance = {schedule: typeof schedule};

export class Cron {
  private cron: CronInstance = cronInstance;

  run() {
    /** Processing jobs every minute **/
    this.cron.schedule('* * * * *', () => {
      jobService.execute().catch((err: Error) => {
        logger.error(err);
      });
    });

    /** stop in-progress jobs when it takes too long **/
    this.cron.schedule('*/1 * * * *', () => {
      const delay = 3 * 3600 * 1000; // 3 hours
      const time = new Date(Date.now() - delay);
      Job.findOne({status: JobStatus.PROCESSING, lastAttemptAt: {$lt: time}}).then((job) => {
        if (job) {
          logger.info('FOUND ONE JOB TO BE STOPPED: ' + job.id);
          const currentExecutionJob = jobService.getCurrentExecutionJob();
          const isTheSameJob = currentExecutionJob && `${currentExecutionJob.id}` === `${job.id}`;

          isTheSameJob ? jobService.stopCurrentJobExecution() : jobService.stopJobExecution(job);
        }
      });
    });

    /** Cleanup done jobs every hour **/
    this.cron.schedule('0 * * * *', async () => {
      const date = new Date(new Date().getTime() - 86400 * 1000);
      await Job.deleteMany({status: JobStatus.DONE, lastAttemptAt: {$lt: date}});
    });
  }
}

const cron = new Cron();
export default cron;
