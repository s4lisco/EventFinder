// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Organizer } from '../organizer/organizer.entity';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string; role: string }> {
    const lowerEmail = email.toLowerCase();

    // Check organizers first
    const organizer = await this.organizerRepository.findOne({
      where: { email: lowerEmail },
    });

    if (organizer) {
      const isMatch = await bcrypt.compare(password, organizer.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      if (!organizer.emailVerified) {
        throw new UnauthorizedException('EMAIL_NOT_VERIFIED');
      }

      if (!organizer.isActive) {
        throw new UnauthorizedException('ACCOUNT_DEACTIVATED');
      }

      const accessToken = await this.jwtService.signAsync({
        sub: organizer.id,
        email: organizer.email,
        role: organizer.role, // 'organizer' or 'admin'
      });
      return { accessToken, role: organizer.role };
    }

    // Fall back to admins table
    const admin = await this.adminRepository.findOne({
      where: { email: lowerEmail },
    });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const accessToken = await this.jwtService.signAsync({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });
      return { accessToken, role: admin.role };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
