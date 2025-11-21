import { Injectable, UnauthorizedException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { Location } from './entities/location.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    try {
      return await this.repo.find();
    } catch (err) {
      this.logger.error('Error in EventsService.findAll', err as any);
      throw err;
    }
  }

  async findOne(id: string): Promise<Event | null> {
    try {
      return await this.repo.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(`Error in EventsService.findOne id=${id}`, err as any);
      throw err;
    }
  }

  async create(data: Partial<Event>): Promise<Event> {
    try {
      const e = this.repo.create(data);
      return await this.repo.save(e);
    } catch (err) {
      this.logger.error('Error in EventsService.create', err as any);
      throw err;
    }
  }
}