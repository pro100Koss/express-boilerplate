import {IJob} from '@/models/Job';
import {JobLog} from '@/libs/JobLog';

export type ExampleJobData = {
  videoId: string;
};

export const exampleJob = async (job: IJob<ExampleJobData>, jobLog: JobLog) => {
  jobLog.info(`done`);
};
