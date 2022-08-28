import Job, {IJob} from '@/models/Job';
import logger from '@/components/logger';
import {JobStatus} from '@/types/JobStatus';
import {JobServicePushJobsData} from '@/types/JobServicePushJobsData';
import {JobLog} from '@/libs/JobLog';
import {exampleJob} from '@/jobs/exampleJob';

const MAX_ATTEMPTS = 3;

export enum JobServiceJobs {
  example = 'example',
}

const JobsMap: {[key: string]: (job: IJob, jobLog: JobLog, service: JobService) => Promise<void>} = {
  [JobServiceJobs.example]: exampleJob,
};

export class JobService {
  protected currentExecutionJob?: IJob;

  public push = async (jobName: JobServiceJobs, jobParams: JobServicePushJobsData, dateStart: Date | null = null) => {
    const model = new Job({
      name: jobName,
      data: jobParams,
      error: '',
      attempts: 0,
      status: JobStatus.NEW,
      createdAt: new Date(),
      lastAttemptAt: null,
      nextAttemptAt: dateStart !== null ? dateStart : new Date(),
    });

    const job = await model.save().catch((err: Error) => {
      logger.error(`Failed to add new job ${err}`);
      return null;
    });

    if (job) {
      logger.info('Added new job [' + job.name + '] execTime=' + job.nextAttemptAt);
      return job;
    }
    return null;
  };

  public take = async (): Promise<IJob | null> => {
    const job = await Job.findOne({status: JobStatus.PROCESSING});
    if (job) {
      logger.info(`Can not take job because one job is processing #Job=${job.id}`);
      return null;
    }

    try {
      const createCondition = () => ({
        $and: [
          {status: {$ne: JobStatus.DONE}},
          {
            nextAttemptAt: {$lt: new Date()},
            $or: [{status: JobStatus.NEW}, {status: JobStatus.FAILED, attempts: {$lt: MAX_ATTEMPTS}}],
          },
        ],
      });

      let condition = createCondition();
      await Job.updateOne(condition);

      condition = createCondition();
      return await Job.findOne(condition);
    } catch (e) {
      logger.error(e);
    }

    return null;
  };

  execute = async () => {
    const job = await this.take();
    return !!job && (await this.executeJob(job));
  };

  protected executeJob = async (job: IJob) => {
    // check is the job executor exists
    if (!JobsMap[job.name]) {
      job.status = JobStatus.FAILED;
      job.error = 'Can not process this job';
      await job.save();

      logger.warning(`Job ${job.name} not found`);
      return false;
    }

    // set processing status
    job.status = JobStatus.PROCESSING;
    job.error = '';
    job.lastAttemptAt = new Date();
    await job.save();
    logger.info(`Processing job: #${job.id} [${job.name}] ${new Date().toUTCString()}`);

    const jobLog = new JobLog();
    const jobExecutor = JobsMap[job.name];

    try {
      await jobExecutor(job, jobLog, this);
      job.status = JobStatus.DONE;
      job.nextAttemptAt = new Date();
      job.error = '';
      job.log = jobLog.toString();
      job.attempts += 1;
      await job.save();

      logger.info('Processing job: #' + job.id + ' [' + job.name + '] ==> DONE');
      return true;
    } catch (err) {
      logger.error(err);
      logger.info(`Job failed: ${job.name} ${err.message || err}`);

      job.status = JobStatus.FAILED;
      job.error = `Failed to execute job: ${err}${err.stacktrace ? '\r\n' + err.stacktrace : ''}`;
      job.workerName = null;
      job.log = jobLog.toString();
      job.attempts += 1;
      job.nextAttemptAt = new Date(new Date().getTime() + 5 * 60 * 1000);
      await job.save();
      return false;
    }
  };

  getCurrentExecutionJob = () => this.currentExecutionJob;

  stopCurrentJobExecution = async () => {
    if (this.currentExecutionJob) {
      await this.stopJobExecution(this.currentExecutionJob);
      this.currentExecutionJob = undefined;
    }
  };

  stopJobExecution = async (job: IJob) => {
    job.status = JobStatus.FAILED;
    job.error = 'Stopped by application';
    job.nextAttemptAt = new Date();
    await job.save();
    console.log(`Job #${job.id} execution stopped due shutdown`);
  };
}

const jobService = new JobService();
export default jobService;
