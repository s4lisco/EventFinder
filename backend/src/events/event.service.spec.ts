// backend/src/event/event.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventImage } from './entities/event-image.entity';
import { Organizer } from '../organizer/organizer.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let eventRepo: Repository<Event>;
  let imageRepo: Repository<EventImage>;
  let organizerRepo: Repository<Organizer>;
  let storageService: any;

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
        {
          provide: getRepositoryToken(EventImage),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organizer),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: 'StorageService',
          useValue: {
            store: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepo = module.get<Repository<Event>>(getRepositoryToken(Event));
    imageRepo = module.get<Repository<EventImage>>(getRepositoryToken(EventImage));
    organizerRepo = module.get<Repository<Organizer>>(getRepositoryToken(Organizer));
    storageService = module.get('StorageService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(eventRepo).toBeDefined();
    expect(imageRepo).toBeDefined();
    expect(organizerRepo).toBeDefined();
    expect(storageService).toBeDefined();
  });

  describe('uploadImages', () => {
    it('should upload images successfully', async () => {
      const mockEvent = {
        id: 'event-1',
        organizerId: 'organizer-1',
        eventImages: [],
      } as unknown as Event;
      
      const mockFiles = [
        { buffer: Buffer.from('test'), originalname: 'test.jpg' },
      ] as any[];

      const mockUser = { userId: 'organizer-1', role: 'organizer' };

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(mockEvent);
      storageService.store.mockResolvedValue({ key: 'test-key', url: 'http://test.url' });
      jest.spyOn(imageRepo, 'create').mockReturnValue({ id: 'image-1' } as EventImage);
      jest.spyOn(imageRepo, 'save').mockResolvedValue({ id: 'image-1' } as EventImage);

      const result = await service.uploadImages('event-1', mockUser, mockFiles);

      expect(result).toHaveLength(1);
      expect(storageService.store).toHaveBeenCalledWith(mockFiles[0], 'event-1');
    });

    it('should reject when exceeding max 3 images', async () => {
      const mockEvent = {
        id: 'event-1',
        organizerId: 'organizer-1',
        eventImages: [{ id: '1' }, { id: '2' }, { id: '3' }],
      } as unknown as Event;

      const mockFiles = [{ buffer: Buffer.from('test') }] as any[];
      const mockUser = { userId: 'organizer-1', role: 'organizer' };

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(mockEvent);

      await expect(
        service.uploadImages('event-1', mockUser, mockFiles),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      const mockEvent = {
        id: 'event-1',
        organizerId: 'organizer-1',
      } as unknown as Event;

      const mockImage = {
        id: 'image-1',
        eventId: 'event-1',
        storageKey: 'test-key',
      } as EventImage;

      const mockUser = { userId: 'organizer-1', role: 'organizer' };

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(mockEvent);
      jest.spyOn(imageRepo, 'findOne').mockResolvedValue(mockImage);
      jest.spyOn(imageRepo, 'remove').mockResolvedValue(mockImage);

      await service.deleteImage('event-1', 'image-1', mockUser);

      expect(storageService.delete).toHaveBeenCalledWith('test-key');
      expect(imageRepo.remove).toHaveBeenCalledWith(mockImage);
    });

    it('should throw NotFoundException when image not found', async () => {
      const mockEvent = {
        id: 'event-1',
        organizerId: 'organizer-1',
      } as unknown as Event;

      const mockUser = { userId: 'organizer-1', role: 'organizer' };

      jest.spyOn(eventRepo, 'findOne').mockResolvedValue(mockEvent);
      jest.spyOn(imageRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.deleteImage('event-1', 'image-1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createForOrganizer', () => {
    it('should create event successfully when organizer exists', async () => {
      const mockOrganizer = {
        id: 'organizer-1',
        name: 'Test Organizer',
        email: 'test@example.com',
      } as Organizer;

      const createEventDto = {
        title: 'Test Event',
        description: 'Test Description',
        startDate: '2026-03-01T18:00:00Z',
        endDate: '2026-03-01T22:00:00Z',
        category: 'music',
        locationName: 'Test Venue',
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060,
        organizerName: 'Test Organizer',
        priceInfo: 'Free',
        website: 'https://test.com',
        images: [],
      };

      const mockEvent = {
        id: 'event-1',
        ...createEventDto,
        organizerId: 'organizer-1',
      } as unknown as Event;

      jest.spyOn(organizerRepo, 'findOne').mockResolvedValue(mockOrganizer);
      jest.spyOn(eventRepo, 'create').mockReturnValue(mockEvent);
      jest.spyOn(eventRepo, 'save').mockResolvedValue(mockEvent);

      const result = await service.createForOrganizer('organizer-1', createEventDto);

      expect(organizerRepo.findOne).toHaveBeenCalledWith({ where: { id: 'organizer-1' } });
      expect(result).toBeDefined();
      expect(result.id).toBe('event-1');
    });

    it('should throw NotFoundException when organizer does not exist', async () => {
      const createEventDto = {
        title: 'Test Event',
        description: 'Test Description',
        startDate: '2026-03-01T18:00:00Z',
        endDate: '2026-03-01T22:00:00Z',
        category: 'music',
        locationName: 'Test Venue',
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060,
        organizerName: 'Test Organizer',
        priceInfo: 'Free',
        website: 'https://test.com',
        images: [],
      };

      jest.spyOn(organizerRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.createForOrganizer('invalid-organizer-id', createEventDto),
      ).rejects.toThrow(NotFoundException);

      expect(organizerRepo.findOne).toHaveBeenCalledWith({ where: { id: 'invalid-organizer-id' } });
      expect(eventRepo.create).not.toHaveBeenCalled();
      expect(eventRepo.save).not.toHaveBeenCalled();
    });
  });

  // TODO: add tests for findAll filters, update, remove
});
