import {StorageAdapter} from './StorageAdapter';
import logger from '@/components/logger';
import {s3} from '@/services/S3StorageService';
import {S3} from 'aws-sdk';

export class S3StorageAdapter implements StorageAdapter {
  bucket = process.env.AWS_S3_BUCKET as string;
  region = process.env.AWS_S3_REGION as string;

  constructor(bucket: string) {
    if (!bucket) {
      logger.error('AWS bucket not configured for ' + this.constructor.name);
    }
    this.bucket = bucket;
  }

  exists(path: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await s3
          .headObject({
            Bucket: this.bucket,
            Key: path,
          })
          .promise();
        resolve(true);
      } catch (err) {
        if (err.code === 'NotFound') {
          resolve(false);
        } else {
          reject(err);
        }
      }
    });
  }

  unlink(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const params: S3.DeleteObjectRequest = {
        Bucket: this.bucket,
        Key: path,
      };
      s3.deleteObject(params, (err) => {
        if (err) {
          logger.error(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  put(
    path: string,
    binaryData: string | Buffer | Uint8Array,
    s3Params: Partial<S3.PutObjectRequest> = {},
  ): Promise<S3.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      const params: S3.PutObjectRequest = {
        Body: binaryData,
        Bucket: this.bucket,
        Key: path,
        ACL: 'public-read',
        ...s3Params,
      };

      s3.putObject(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  url(path: string): string {
    const isLocalMode = process.env.AWS_S3_LOCAL_MODE === 'true';
    const customDomain = process.env.AWS_S3_BUCKET_DOMAIN;

    const host = customDomain ? `${customDomain}` : `https://s3.${this.region}.amazonaws.com/${this.bucket}`;

    return !isLocalMode ? `${host}/${path}` : `http://localhost:8000/${this.bucket}/${path}`;
  }
}

const s3StorageAdapter = new S3StorageAdapter(process.env.AWS_S3_BUCKET as string);
export default s3StorageAdapter;
