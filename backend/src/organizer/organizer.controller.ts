// backend/src/organizer/organizer.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LoginOrganizerDto } from './dto/login-organizer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

@Controller('organizers')
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: CreateOrganizerDto) {
    return this.organizerService.signup(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginOrganizerDto) {
      console.log('🟢 Reached login controller with DTO:', dto);  // 👈 add this

    return this.organizerService.login(dto);
  }

  @Get(':id/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async getEventsForOrganizer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    // Optionally enforce that organizers can only access their own events
    // Admins can access any organizer's events
    const user = req.user as { sub: string; role: string };
    if (user.role === 'organizer' && user.sub !== id) {
      // you could throw ForbiddenException here, but keeping it simple
      return this.organizerService.getEventsForOrganizer(user.sub);
    }

    return this.organizerService.getEventsForOrganizer(id);
  }
}
