// backend/src/event/event.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventImage } from './entities/event-image.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  let eventRepo: Repository<Event>;
  let imageRepo: Repository<EventImage>;
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
    storageService = module.get('StorageService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(eventRepo).toBeDefined();
    expect(imageRepo).toBeDefined();
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

  // TODO: add tests for findAll filters, create, update, remove
});
