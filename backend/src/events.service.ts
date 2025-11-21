import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event } from './events/entities/event.entity';
import { Location } from './events/entities/location.entity';
import { User } from './users/entities/user.entity';
import { CreateEventDto } from './events/dto/create-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Location) private locationsRepo: Repository<Location>,
    private dataSource: DataSource,
  ) {}

  async findPublicApproved(): Promise<Event[]> {
    try {
      return await this.eventsRepo.find({
        where: { status: 'APPROVED' } as any,
        relations: ['location', 'creator'],
        order: { date: 'ASC' } as any,
      });
    } catch (err) {
      this.logger.error('Error in EventsService.findPublicApproved', err as any);
      throw new InternalServerErrorException('Unable to load events');
    }
  }

  async findEventsByCreator(userId: string): Promise<Event[]> {
    try {
      return await this.eventsRepo.find({
        where: [
          { creator_id: userId } as any,
          { creator: { id: userId } } as any,
        ],
        relations: ['location', 'creator'],
      });
    } catch (err) {
      this.logger.error(`Error in EventsService.findEventsByCreator userId=${userId}`, err as any);
      throw new InternalServerErrorException('Unable to load user events');
    }
  }

  private async findOrCreateLocation(lat?: number, lon?: number): Promise<Location | null> {
    if (lat == null || lon == null) return null;

    // use findOne with explicit where and types to avoid ambiguous overload resolution
    let loc: Location | null = await this.locationsRepo.findOne({
      where: { lat, lon } as any,
    });

    if (!loc) {
      // create returns DeepPartial<Location>
      const partial = this.locationsRepo.create({ lat, lon } as any);

      // save may return Location or Location[] — handle both safely
      const saved: Location | Location[] = await this.locationsRepo.save(partial as any);
      loc = Array.isArray(saved) ? saved[0] : (saved as Location);
    }

    return loc;
  }

  async create(createEventDto: CreateEventDto, userId: string, userRole: string): Promise<Event> {
    if (userRole !== 'CREATOR' && userRole !== 'ADMIN') {
      throw new UnauthorizedException('Nur "Creator" dürfen Events erstellen.');
    }

    const { title, description, date, category, lat, lon } = createEventDto;

    try {
      return await this.dataSource.transaction<Event>(async manager => {
         let location: Location | null = null;
         if (lat != null && lon != null) {
           // use findOneBy on transactional repository as well
           location = await manager.getRepository(Location).findOneBy({ lat, lon } as any);
           if (!location) {
             const partialLoc = manager.getRepository(Location).create({ lat, lon } as any);
             const savedLoc: Location | Location[] = await manager.getRepository(Location).save(partialLoc as any);
             location = Array.isArray(savedLoc) ? (savedLoc[0] as Location) : (savedLoc as Location);
           }
         }
 
         const payload: any = {
           title,
           description,
           date: date ? new Date(date) : null,
           category,
           location: location ?? null,
           status: 'PENDING',
           creator: { id: userId },
           creator_id: userId,
         };
 
         const newEvent = manager.getRepository(Event).create(payload);
         const saved = await manager.getRepository(Event).save(newEvent);
         return Array.isArray(saved) ? (saved[0] as Event) : (saved as Event);
       });
     } catch (err) {
      this.logger.error('Error in EventsService.create', err as any);
      throw new InternalServerErrorException('Unable to create event');
    }
  }
}
