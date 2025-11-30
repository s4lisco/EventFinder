// backend/src/flyer/flyer.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FlyerService } from './flyer.service';
import { ExtractedEventDto } from './dto/extract-event.dto';
import { Public } from '../auth/public.decorator';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

@Controller('flyer')
export class FlyerController {
  constructor(private readonly flyerService: FlyerService) {}

  @Public()
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadFlyer(
    @UploadedFile() file: MulterFile,
  ): Promise<ExtractedEventDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.flyerService.processFlyer(file.buffer);
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to process flyer: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
