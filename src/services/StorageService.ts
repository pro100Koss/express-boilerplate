import fs from 'fs';

const crypto = require('crypto');
const path = require('path');

const STORAGE_PATH = path.normalize(process.env.STORAGE_PATH || './storage');

class StorageService {
  createHash = (originalName = '') =>
    crypto
      .createHash('sha1')
      .update(new Date().getTime() + '_' + originalName)
      .digest('hex');

  getStoragePath = () => STORAGE_PATH;

  createStorageStructure = () => {
    const storagePath = this.getStoragePath();
    const subDirectories = ['tmp', 'videos', 's3-download'];

    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

    for (const subDir of subDirectories) {
      const subPath = path.join(storagePath, subDir);
      if (!fs.existsSync(subPath)) fs.mkdirSync(subPath);
    }
  };
}

const storageService = new StorageService();

export default storageService;
