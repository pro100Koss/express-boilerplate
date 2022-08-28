import {StorageAdapter, StorageTypes} from '@/libs/storage';
import s3StorageAdapter from '../libs/storage/S3StorageAdapter';
import localStorageAdapter from '../libs/storage/LocalStorageAdapter';

function storage(type: StorageTypes = StorageTypes.LOCAL): StorageAdapter {
  switch (type) {
    case StorageTypes.S3: {
      return s3StorageAdapter;
    }
    case StorageTypes.LOCAL:
    default: {
      return localStorageAdapter;
    }
  }
}

export default storage;
