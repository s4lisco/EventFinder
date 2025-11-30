// backend/src/flyer/flyer.module.ts
import { Module } from '@nestjs/common';
import { FlyerController } from './flyer.controller';
import { FlyerService } from './flyer.service';

@Module({
  controllers: [FlyerController],
  providers: [FlyerService],
  exports: [FlyerService],
})
export class FlyerModule {}
