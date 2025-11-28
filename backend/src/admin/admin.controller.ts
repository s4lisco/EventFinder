import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { EventStatus } from '../events/event-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Event } from '../events/event.entity';
import { Public } from '../auth/public.decorator';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 👇 Add this (bypasses auth)
  @Public()
  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  // Only for authenticated admins
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
    return this.adminService.updateEventStatus(id, {
      status: EventStatus.APPROVED,
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put('events/:id/reject')
  async rejectEvent(
    @Param('id') id: string,
    @Body('adminComment') adminComment?: string,
  ): Promise<Event> {
    return this.adminService.updateEventStatus(id, {
      status: EventStatus.REJECTED,
      adminComment,
    });
  }
}
