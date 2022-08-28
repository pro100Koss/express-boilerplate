import fs from 'fs';
import _path from 'path';
import logger from '@/components/logger';
import storageService from '@/services/StorageService';
import {StorageAdapter} from './StorageAdapter';

export class LocalStorageAdapter implements StorageAdapter {
  url(path: string) {
    const storagePath = storageService.getStoragePath();
    path = path.replace(storagePath + '/', '');
    path = path.replace(storagePath, '');
    return `${process.env.APP_URL}/${path}`;
  }

  exists(path: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      fs.stat(_path.join(storageService.getStoragePath(), path), (err: NodeJS.ErrnoException | null) => {
        resolve(!err);
      });
    });
  }

  unlink(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const storagePath = storageService.getStoragePath();
      const normalizedPath = _path.join(storagePath, path).replace(storagePath + storagePath, storagePath);
      fs.unlink(normalizedPath, (err: any) => {
        if (err) {
          logger.error('Can not delete file: ' + err.path);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  put = (path: string, binaryData: any) =>
    new Promise((resolve) => {
      const storagePath = storageService.getStoragePath();
      const finalPath = _path.join(storagePath, path);
      console.log(`PUT FILE: ${finalPath}`);

      fs.writeFile(finalPath, binaryData, () => {
        console.log(`PUT FILE: ${finalPath}  ==> DONE`);
        resolve(true);
      });
    });
}

export const localStorageAdapter = new LocalStorageAdapter();
export default localStorageAdapter;
