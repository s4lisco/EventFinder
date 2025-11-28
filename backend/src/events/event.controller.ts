// backend/src/event/event.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { Event } from './event.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  
  @Public()
  @Get()
  async findAll(@Query() filters: FilterEventsDto): Promise<Event[]> {
    return this.eventService.findAll(filters);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    // user is injected from JWT validation
    const user = req.user as { userId: string; role: string };
    return this.eventService.createForOrganizer(user.userId, createEventDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    const user = req.user as { userId: string; role: string };
    return this.eventService.updateForOrganizer(id, user, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ): Promise<{ success: boolean }> {
    const user = req.user as { userId: string; role: string };
    await this.eventService.removeForOrganizer(id, user);
    return { success: true };
  }
}
