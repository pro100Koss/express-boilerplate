import mongoose, {Schema, Document} from 'mongoose';

export interface ISettings extends Document {
  isVideoRecodingJobsCreated: boolean;
  isShortIdsCreated: boolean;
  isS3BucketsUpdated: boolean;
  isSlugIndexDropped: boolean;
  isDomainsCreatedForCompanies: boolean;
}

const SettingsSchema: Schema = new Schema(
  {
    isVideoRecodingJobsCreated: {type: Boolean, default: false},
    isS3BucketsUpdated: {type: Boolean, default: false},
    isShortIdsCreated: {type: Boolean, default: false},
    isSlugIndexDropped: {type: Boolean, default: false},
    isDomainsCreatedForCompanies: {type: Boolean, default: false},
  },

  {versionKey: false, timestamps: false},
);

const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;
