// backend/src/organizer/organizer.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  @Throttle({ default: { limit: Number(process.env.THROTTLE_LOGIN_LIMIT) || 5, ttl: Number(process.env.THROTTLE_TTL_MS) || 60_000 } })
  @Post('login')
  async login(@Body() dto: LoginOrganizerDto) {
    return this.organizerService.login(dto);
  }

  @Public()
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token fehlt.');
    }
    await this.organizerService.verifyEmail(token);
    return { message: 'E-Mail-Adresse erfolgreich bestätigt.' };
  }

  @Get(':id/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  async getEventsForOrganizer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const user = req.user as { userId: string; role: string };
    if (user.role === 'organizer' && user.userId !== id) {
      return this.organizerService.getEventsForOrganizer(user.userId);
    }

    return this.organizerService.getEventsForOrganizer(id);
  }
}
