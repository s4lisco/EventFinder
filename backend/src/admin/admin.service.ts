// backend/src/admin/admin.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Event, EventStatus } from '../events/event.entity';
import { Organizer } from '../organizer/organizer.entity';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
    private readonly jwtService: JwtService, // 👈 Add this
  ) {}

  // 🔥 ADD LOGIN LOGIC HERE
  async login(email: string, password: string): Promise<{ accessToken: string }> {
    console.log('🔥 Admin login request:', email);

    const admin = await this.adminRepository.findOne({ where: { email: email.toLowerCase() } });
    console.log('🔍 Found admin:', admin);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    console.log('🔑 Password valid:', isValid);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    console.log('🎯 Login successful → token issued');
    return { accessToken };
  }

  async getPendingEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      where: { status: EventStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async updateEventStatus(
    eventId: string,
    dto: UpdateEventStatusDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    event.status = dto.status;
    if (dto.adminComment !== undefined) {
      event.adminComment = dto.adminComment;
    }

    return this.eventRepository.save(event);
  }

  async approveEvent(eventId: string, dto?: UpdateEventStatusDto): Promise<Event> {
    return this.updateEventStatus(eventId, {
      status: EventStatus.APPROVED,
      adminComment: dto?.adminComment,
    });
  }

  async rejectEvent(eventId: string, dto?: UpdateEventStatusDto): Promise<Event> {
    return this.updateEventStatus(eventId, {
      status: EventStatus.REJECTED,
      adminComment: dto?.adminComment,
    });
  }

  async listOrganizers(): Promise<Organizer[]> {
    return this.organizerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async activateOrganizer(id: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({
      where: { id },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    organizer.isActive = true;
    return this.organizerRepository.save(organizer);
  }
}
