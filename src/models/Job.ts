import mongoose, {Schema, Document} from 'mongoose';
import {JobStatus} from '@/types/JobStatus';

export interface IJob<T = any> extends Document {
  name: string;
  status: JobStatus;
  error: string;
  log: string;
  attempts: number;
  limit: number;
  workerName: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastAttemptAt: Date;
  nextAttemptAt: Date;
  data: T;
}

const JobSchema: Schema = new Schema(
  {
    name: String,
    status: {type: String, index: true},
    error: {type: String},
    log: {type: String},
    attempts: {type: Number},
    limit: {type: Number},
    workerName: {type: String, index: true},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    lastAttemptAt: {type: Date},
    nextAttemptAt: {type: Date, index: true},
    data: {type: Object, default: null},
  },
  {
    versionKey: false,
    timestamps: {createdAt: true, updatedAt: true},
    toObject: {
      transform(doc, ret) {
        ret.lastAttemptAt = doc.lastAttemptAt ? doc.lastAttemptAt.getTime() : 0;
        ret.nextAttemptAt = doc.nextAttemptAt ? doc.nextAttemptAt.getTime() : 0;
        ret.updatedAt = doc.updatedAt ? doc.updatedAt.getTime() : 0;
        ret.createdAt = doc.createdAt ? doc.createdAt.getTime() : 0;
        ret.id = doc._id.toString();
        delete ret.__v;
        delete ret._id;
      },
    },
  },
);

const Job = mongoose.model<IJob>('Job', JobSchema);
export default Job;
