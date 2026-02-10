// backend/src/event/event.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, EventStatus } from './event.entity';
import { EventImage } from './entities/event-image.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { Point } from 'typeorm';
import { StorageService } from './storage/storage.interface';

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
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventImage)
    private readonly eventImageRepository: Repository<EventImage>,
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) {}

  async findAll(filters: FilterEventsDto): Promise<Event[]> {
    const qb = this.eventRepository.createQueryBuilder('events');

    if (filters.status) {
      qb.andWhere('events.status = :status', { status: filters.status });
    } else {
      qb.andWhere('events.status = :approved', {
        approved: EventStatus.APPROVED,
      });
    }

    if (filters.category) {
      qb.andWhere('events.category = :category', { category: filters.category });
    }

    if (filters.search) {
      qb.andWhere(
        '(events.title ILIKE :search OR events.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (
      filters.distanceKm !== undefined &&
      filters.lat !== undefined &&
      filters.lon !== undefined
    ) {
      qb.andWhere('events.location IS NOT NULL').andWhere(
        `
        ST_DWithin(
          events.location,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :distance
        )
      `,
        {
          lat: filters.lat,
          lon: filters.lon,
          distance: filters.distanceKm * 1000,
        },
      );
    }
    qb.orderBy('events.startDate', 'ASC');

    return qb.getMany();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ 
      where: { id },
      relations: ['eventImages'],
    });
    if (!event) throw new NotFoundException(`Event with id "${id}" not found`);
    return event;
  }

  async createForOrganizer(
    organizerId: string,
    dto: CreateEventDto,
  ): Promise<Event> {
    const locationPoint: Point = {
      type: 'Point',
      coordinates: [dto.longitude, dto.latitude],
    };

    const event = this.eventRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      organizerId,
      location: locationPoint,
      status: EventStatus.PENDING,
    });

    return this.eventRepository.save(event);
  }

  async updateForOrganizer(
    id: string,
    user: { userId: string; role: string },
    dto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id);

    if (user.role !== 'admin' && event.organizerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to update this event.',
      );
    }

    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      event.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    if (dto.startDate) event.startDate = new Date(dto.startDate);
    if (dto.endDate) event.endDate = new Date(dto.endDate);

    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  async removeForOrganizer(
    id: string,
    user: { userId: string; role: string },
  ): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventImages'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }

    if (user.role !== 'admin' && event.organizerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this event.',
      );
    }

    // Delete all event images from storage before removing event
    if (event.eventImages && event.eventImages.length > 0) {
      const storageKeys = event.eventImages.map(img => img.storageKey);
      await this.storageService.deleteMany(storageKeys);
    }

    await this.eventRepository.remove(event);
  }

  async uploadImages(
    eventId: string,
    user: { userId: string; role: string },
    files: MulterFile[],
  ): Promise<EventImage[]> {
    const event = await this.findOne(eventId);

    if (user.role !== 'admin' && event.organizerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to upload images for this event.',
      );
    }

    // Check current image count
    const currentCount = event.eventImages?.length || 0;
    const newCount = files.length;

    if (currentCount + newCount > 3) {
      throw new BadRequestException(
        `Cannot upload ${newCount} images. Event already has ${currentCount} images. Maximum is 3.`,
      );
    }

    // Upload files and create event image records
    const eventImages: EventImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { key, url } = await this.storageService.store(file, eventId);
      
      const eventImage = this.eventImageRepository.create({
        eventId,
        storageKey: key,
        url,
        position: currentCount + i,
      });

      eventImages.push(await this.eventImageRepository.save(eventImage));
    }

    return eventImages;
  }

  async deleteImage(
    eventId: string,
    imageId: string,
    user: { userId: string; role: string },
  ): Promise<void> {
    const event = await this.findOne(eventId);

    if (user.role !== 'admin' && event.organizerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete images for this event.',
      );
    }

    const image = await this.eventImageRepository.findOne({
      where: { id: imageId, eventId },
    });

    if (!image) {
      throw new NotFoundException(
        `Image with id "${imageId}" not found for event "${eventId}"`,
      );
    }

    // Delete from storage
    await this.storageService.delete(image.storageKey);

    // Delete from database
    await this.eventImageRepository.remove(image);
  }
}
