import AWS, {config, ConfigurationOptions} from 'aws-sdk';
import fs from 'fs';
import logger from '@/components/logger';
import storage from '@/components/storage';
import timeTrackerService from '@/services/TimeTrackerService';
import {StorageTypes} from '@/libs/storage/';

const isLocalMode = process.env.AWS_S3_LOCAL_MODE === 'true';

const localConfiguration = {
  accessKeyId: 'accessKey1',
  secretAccessKey: 'verySecretKey1',
  region: false as unknown as string,
} as ConfigurationOptions;

const remoteConfiguration = {
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET,
} as ConfigurationOptions;

config.update(isLocalMode ? localConfiguration : remoteConfiguration);

const s3LocalConfig = isLocalMode
  ? {
      endpoint: 'http://localhost:8000',
      s3BucketEndpoint: false,
      endpointDiscoveryEnabled: false,
    }
  : {};

// Create S3 service object
export const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  ...s3LocalConfig,
});

export class S3StorageService {
  protected s3: AWS.S3;

  constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  download(path: string, localPath: string, bucket = process.env.AWS_S3_BUCKET as string) {
    logger.info(`Download video ${path} > ${localPath}`);
    return new Promise((resolve, reject) => {
      const params = {
        Key: path,
        Bucket: bucket,
      };
      const downloadTime = timeTrackerService.start();
      const s3Stream = s3.getObject(params).createReadStream();
      const fileStream = fs.createWriteStream(localPath);
      const handleError = (error: Error) => {
        reject(error);

        fs.unlink(localPath, () => {}); //eslint-disable-line
      };
      s3Stream.on('error', handleError);
      fileStream.on('error', handleError);
      fileStream.on('close', () => {
        downloadTime.stop();
        logger.info(`Download completed in ${downloadTime.getSeconds()}sec`);
        resolve(true);
      });
      s3Stream.pipe(fileStream);
    });
  }

  upload(localPath: string, destPath: string) {
    const storageS3 = storage(StorageTypes.S3);

    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(localPath);
      fileStream.on('error', (err: Error) => {
        logger.error(`file stream error: ${err}`);
        reject(err);
      });

      fileStream.on('ready', () => {
        storageS3.put(destPath, fileStream).then(resolve).catch(reject);
      });
    });
  }
}

export const s3StorageService = new S3StorageService(s3);
export default s3StorageService;
