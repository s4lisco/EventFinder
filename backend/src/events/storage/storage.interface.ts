// Define Multer File type inline
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface StorageService {
  /**
   * Store a file and return the storage key and public URL
   */
  store(file: MulterFile, path: string): Promise<{ key: string; url: string }>;

  /**
   * Delete a file by its storage key
   */
  delete(key: string): Promise<void>;

  /**
   * Delete multiple files by their storage keys
   */
  deleteMany(keys: string[]): Promise<void>;
}
