// backend/src/organizer/organizer.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizerService } from './organizer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organizer } from './organizer.entity';
import { Event } from '../events/event.entity';
import { JwtService } from '@nestjs/jwt';

describe('OrganizerService', () => {
  let service: OrganizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizerService,
        {
          provide: getRepositoryToken(Organizer),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizerService>(OrganizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: add tests for signup, login, getEventsForOrganizer
});
