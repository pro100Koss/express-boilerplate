import Settings, {ISettings} from '@/models/Settings';

class SettingsService {
  private settings: ISettings;

  constructor() {
    this.settings = new Settings({});
  }

  load = async () => {
    const settings = await Settings.findOne();

    if (settings) {
      this.settings = settings;
    }
  };

  save = () => this.settings.save();

  get isVideoRecodingJobsCreated() {
    return this.settings.isVideoRecodingJobsCreated;
  }

  set isVideoRecodingJobsCreated(value) {
    this.settings.isVideoRecodingJobsCreated = value;
  }

  get isS3BucketsUpdated() {
    return this.settings.isS3BucketsUpdated;
  }

  set isS3BucketsUpdated(value: boolean) {
    this.settings.isS3BucketsUpdated = value;
  }

  get isDomainsCreatedForCompanies() {
    return this.settings.isDomainsCreatedForCompanies;
  }

  set isDomainsCreatedForCompanies(value: boolean) {
    this.settings.isDomainsCreatedForCompanies = value;
  }

  get isShortIdsCreated() {
    return this.settings.isShortIdsCreated;
  }

  set isShortIdsCreated(value) {
    this.settings.isShortIdsCreated = value;
  }

  get isSlugIndexDropped() {
    return this.settings.isSlugIndexDropped;
  }

  set isSlugIndexDropped(value) {
    this.settings.isSlugIndexDropped = value;
  }
}

const settingsService = new SettingsService();
export default settingsService;
