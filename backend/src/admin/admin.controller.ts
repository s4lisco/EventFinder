// backend/src/admin/admin.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { EventStatus } from '../events/event-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Event } from '../events/event.entity';
import { Public } from '../auth/public.decorator';
import { LoginAdminDto } from './dto/login-admin.dto';

const AdminGuards = [UseGuards(AuthGuard('jwt'), RolesGuard), Roles('admin')];

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Auth ──────────────────────────────────────────────────────────────────

  @Public()
  @Throttle({ default: { limit: Number(process.env.THROTTLE_LOGIN_LIMIT) || 5, ttl: Number(process.env.THROTTLE_TTL_MS) || 60_000 } })
  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  // ── Events ────────────────────────────────────────────────────────────────

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('events')
  async getPendingEvents(): Promise<Event[]> {
    return this.adminService.getPendingEvents();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put('events/:id/approve')
  async approveEvent(@Param('id') id: string): Promise<Event> {
    return this.adminService.approveEvent(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put('events/:id/reject')
  async rejectEvent(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Event> {
    if (!reason || reason.trim().length < 10) {
      throw new BadRequestException('Begründung muss mindestens 10 Zeichen enthalten.');
    }
    return this.adminService.rejectEvent(id, reason.trim());
  }

  // ── Organizers ────────────────────────────────────────────────────────────

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('organizers')
  async listOrganizers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.listOrganizers(page, limit, search);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('organizers/:id')
  async getOrganizer(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminService.getOrganizerById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put('organizers/:id')
  async updateOrganizer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrganizerDto,
    @Req() req: any,
  ) {
    const adminId = req.user?.userId ?? req.user?.sub;
    return this.adminService.updateOrganizer(id, dto, adminId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete('organizers/:id')
  async deactivateOrganizer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const adminId = req.user?.userId ?? req.user?.sub;
    await this.adminService.deactivateOrganizer(id, adminId);
    return { success: true };
  }
}
