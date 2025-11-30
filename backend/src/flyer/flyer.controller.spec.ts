// backend/src/flyer/flyer.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FlyerController } from './flyer.controller';
import { FlyerService } from './flyer.service';
import { BadRequestException } from '@nestjs/common';

describe('FlyerController', () => {
  let controller: FlyerController;
  let service: FlyerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlyerController],
      providers: [
        {
          provide: FlyerService,
          useValue: {
            processFlyer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FlyerController>(FlyerController);
    service = module.get<FlyerService>(FlyerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFlyer', () => {
    it('should throw BadRequestException when no file is uploaded', async () => {
      await expect(controller.uploadFlyer(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call processFlyer with file buffer', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
      };

      const mockResult = {
        title: 'Test Event',
        needsManualReview: false,
      };

      (service.processFlyer as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.uploadFlyer(mockFile);

      expect(service.processFlyer).toHaveBeenCalledWith(mockFile.buffer);
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException when service fails', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
      };

      (service.processFlyer as jest.Mock).mockRejectedValue(
        new Error('OCR failed'),
      );

      await expect(controller.uploadFlyer(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
