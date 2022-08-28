export interface StorageAdapter {
  exists(path: string): Promise<boolean>;

  put(path: string, binaryData: any): Promise<any>;

  unlink(path: string): Promise<boolean>;

  url(path: string): string;
}
