// backend/src/admin/admin.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Event } from '../events/event.entity';
import { Organizer } from '../organizer/organizer.entity';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organizer),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: test getPendingEvents, approveEvent, rejectEvent, activateOrganizer
});
