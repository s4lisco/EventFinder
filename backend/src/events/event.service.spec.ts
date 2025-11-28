// backend/src/event/event.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';

describe('EventService', () => {
  let service: EventService;
  let repo: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  // TODO: add tests for findAll filters, create, update, remove
});
