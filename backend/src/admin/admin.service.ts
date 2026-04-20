// backend/src/admin/admin.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Event } from '../events/event.entity';
import { EventStatus } from '../events/event-status.enum';
import { Organizer } from '../organizer/organizer.entity';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

export interface PaginatedOrganizers {
  data: Omit<Organizer, 'passwordHash' | 'emailVerificationToken'>[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
    private readonly jwtService: JwtService,
  ) {}

  // ── Auth ────────────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const admin = await this.adminRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      this.logger.warn(`Failed admin login attempt: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.log(`Admin logged in: ${email}`);
    return { accessToken };
  }

  // ── Events ──────────────────────────────────────────────────────────────────

  async getPendingEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      where: { status: EventStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async updateEventStatus(eventId: string, dto: UpdateEventStatusDto): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    event.status = dto.status;
    if (dto.adminComment !== undefined) event.adminComment = dto.adminComment;
    return this.eventRepository.save(event);
  }

  async approveEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    event.status = EventStatus.APPROVED;
    event.approvedAt = new Date();
    event.rejectionReason = null;
    event.rejectedAt = null;
    return this.eventRepository.save(event);
  }

  async rejectEvent(eventId: string, reason: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    event.status = EventStatus.REJECTED;
    event.rejectionReason = reason;
    event.rejectedAt = new Date();
    event.approvedAt = null;
    return this.eventRepository.save(event);
  }

  // ── Organizers ───────────────────────────────────────────────────────────────

  private sanitize(organizer: Organizer) {
    const { passwordHash, emailVerificationToken, ...rest } = organizer as any;
    return rest;
  }

  async listOrganizers(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<PaginatedOrganizers> {
    const qb = this.organizerRepository.createQueryBuilder('o');

    if (search) {
      qb.where(
        '(LOWER(o.name) LIKE LOWER(:s) OR LOWER(o.email) LIKE LOWER(:s))',
        { s: `%${search}%` },
      );
    }

    const total = await qb.getCount();

    const organizers = await qb
      .loadRelationCountAndMap('o.eventCount', 'o.events')
      .orderBy('o.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: organizers.map((o) => this.sanitize(o)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrganizerById(id: string) {
    const organizer = await this.organizerRepository.findOne({
      where: { id },
      relations: ['events'],
    });
    if (!organizer) throw new NotFoundException('Organizer not found');
    return this.sanitize(organizer);
  }

  async updateOrganizer(
    id: string,
    dto: UpdateOrganizerDto,
    adminId: string,
  ) {
    const organizer = await this.organizerRepository.findOne({ where: { id } });
    if (!organizer) throw new NotFoundException('Organizer not found');

    if (dto.email && dto.email.toLowerCase() !== organizer.email) {
      const conflict = await this.organizerRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (conflict) throw new ConflictException('Email already in use');
      organizer.email = dto.email.toLowerCase();
    }

    if (dto.name !== undefined) organizer.name = dto.name;
    if (dto.isActive !== undefined) organizer.isActive = dto.isActive;
    if (dto.role !== undefined) organizer.role = dto.role;

    const saved = await this.organizerRepository.save(organizer);
    this.logger.log(
      `Admin ${adminId} updated organizer ${id}: ${JSON.stringify(dto)}`,
    );
    return this.sanitize(saved);
  }

  async deactivateOrganizer(id: string, adminId: string): Promise<void> {
    if (id === adminId) {
      throw new BadRequestException('You cannot deactivate yourself.');
    }

    const organizer = await this.organizerRepository.findOne({ where: { id } });
    if (!organizer) throw new NotFoundException('Organizer not found');

    organizer.isActive = false;
    await this.organizerRepository.save(organizer);

    // Archive all events of this organizer
    await this.eventRepository
      .createQueryBuilder()
      .update(Event)
      .set({ status: EventStatus.ARCHIVED })
      .where('organizerId = :id', { id })
      .andWhere('status != :archived', { archived: EventStatus.ARCHIVED })
      .execute();

    this.logger.log(`Admin ${adminId} deactivated organizer ${id}`);
  }

  // Legacy helpers used elsewhere
  async listOrganizersSimple(): Promise<Organizer[]> {
    return this.organizerRepository.find({ order: { createdAt: 'DESC' } });
  }

  async activateOrganizer(id: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({ where: { id } });
    if (!organizer) throw new NotFoundException('Organizer not found');
    organizer.isActive = true;
    return this.organizerRepository.save(organizer);
  }
}
