// backend/src/event/event.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { Event } from './event.entity';
import { EventImage } from './entities/event-image.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

const ALLOWED_IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Define Multer File type inline
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  
  @Public()
  @Get()
  async findAll(@Query() filters: FilterEventsDto): Promise<Event[]> {
    return this.eventService.findAll(filters);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    // user is injected from JWT validation
    const user = req.user as { userId: string; role: string };
    return this.eventService.createForOrganizer(user.userId, createEventDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    const user = req.user as { userId: string; role: string };
    return this.eventService.updateForOrganizer(id, user, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ): Promise<{ success: boolean }> {
    const user = req.user as { userId: string; role: string };
    await this.eventService.removeForOrganizer(id, user);
    return { success: true };
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Invalid file type. Allowed types: ${ALLOWED_IMAGE_MIMETYPES.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: MulterFile[],
    @Req() req: any,
  ): Promise<EventImage[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const user = req.user as { userId: string; role: string };
    return this.eventService.uploadImages(id, user, files);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async deleteImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('imageId', new ParseUUIDPipe()) imageId: string,
    @Req() req: any,
  ): Promise<{ success: boolean }> {
    const user = req.user as { userId: string; role: string };
    await this.eventService.deleteImage(id, imageId, user);
    return { success: true };
  }
}
