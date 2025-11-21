import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('api/events') // if you set global prefix 'api' in main.ts, use @Controller('events') instead
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly svc: EventsService) {}

  @Get()
  async getAll() {
    try {
      return await this.svc.findAll();
    } catch (err) {
      this.logger.error('GET /api/events failed', err as any);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.svc.findOne(id);
    } catch (err) {
      this.logger.error(`GET /api/events/${id} failed`, err as any);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.svc.create(body);
    } catch (err) {
      this.logger.error('POST /api/events failed', err as any);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
