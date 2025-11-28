// backend/src/organizer/organizer.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizer } from './organizer.entity';
import { Repository } from 'typeorm';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LoginOrganizerDto } from './dto/login-organizer.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Event } from '../events/event.entity';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeOrganizer(organizer: Organizer) {
    const { passwordHash, ...rest } = organizer;
    return rest;
  }

  async signup(dto: CreateOrganizerDto) {
    const existing = await this.organizerRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const organizer = this.organizerRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
    });

    const saved = await this.organizerRepository.save(organizer);
    return this.sanitizeOrganizer(saved);
  }

  async validateOrganizer(
    email: string,
    password: string,
  ): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({
      where: { email: email.toLowerCase() },
    });
     console.log('▶ Organizer found:', organizer);
  console.log('▶ Incoming password:', password);
  console.log('▶ Stored hash:', organizer?.passwordHash);

    if (!organizer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, organizer.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return organizer;
  }

  async login(dto: LoginOrganizerDto): Promise<{ accessToken: string }> {
    const organizer = await this.validateOrganizer(dto.email, dto.password);

    const payload = {
      sub: organizer.id,
      email: organizer.email,
      role: 'organizer',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async findById(id: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({ where: { id } });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }
    return organizer;
  }

  async getEventsForOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { organizerId },
      order: { startDate: 'ASC' },
    });
  }
}
