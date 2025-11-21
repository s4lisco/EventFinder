import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Platzhalter

// DTO (Data Transfer Object)
export class CreateEventDto {
  title: string;
  description: string;
  date: string; // ISO date string
  category: string;
  lat: number;
  lon: number;
  price_info?: string;
}

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Öffentliche Route: Holt alle genehmigten Events
   */
  @Get()
  async findPublicApproved() {
    return this.eventsService.findPublicApproved();
  }

  /**
   * Private Route: Holt alle Events, die der angemeldete User erstellt hat
   * (Wird von der Profilseite verwendet)
   */
  @Get('my-events')
  // @UseGuards(JwtAuthGuard) // Schützt diese Route
  async findMyEvents(@Request() req) {
    // req.user wird vom JwtAuthGuard gesetzt (z.B. { userId: '...'. role: '...' })
    // MOCK:
    const mockUser = req.user || { userId: 'mock-creator-id', role: 'CREATOR' };
    
    return this.eventsService.findEventsByCreator(mockUser.userId);
  }


  /**
   * Private Route: Erstellt ein neues Event (Status: PENDING)
   * Nur für 'CREATOR' oder 'ADMIN'
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard) // Schützt diese Route
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // req.user wird vom JwtAuthGuard gesetzt
    // MOCK:
    const mockUser = req.user || { userId: 'mock-creator-id', role: 'CREATOR' };

    return this.eventsService.create(createEventDto, mockUser.userId, mockUser.role);
  }
}