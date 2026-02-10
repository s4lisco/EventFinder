import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Define Multer File type inline
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class LocalDiskStorage implements StorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'event-images');
  private readonly baseUrl = process.env.UPLOAD_BASE_URL || 'http://localhost:4000';

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async store(file: MulterFile, pathPrefix: string): Promise<{ key: string; url: string }> {
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const key = path.join(pathPrefix, filename);
    const fullPath = path.join(this.uploadDir, key);

    // Ensure subdirectory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file.buffer);

    const url = `${this.baseUrl}/uploads/event-images/${key}`;

    return { key, url };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, key);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      // Ignore ENOENT errors (file doesn't exist)
      if (error.code !== 'ENOENT') {
        console.error(`Failed to delete file ${key}:`, error);
      }
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.delete(key)));
  }
}
