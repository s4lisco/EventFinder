import { Controller, Get, Patch, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard'; // Eigener Guard, der Rollen prüft
// import { Roles } from '../auth/roles.decorator'; // Eigener Decorator

@Controller('api/admin')
// @UseGuards(JwtAuthGuard, RolesGuard) // Schützt die gesamte Controller-Klasse
// @Roles('ADMIN') // Nur Admins dürfen auf diese Routen zugreifen
export class AdminController {
  
  // constructor(
  //   private readonly adminService: AdminService, // Ein Service, der die DB-Logik kapselt
  // ) {}

  /**
   * Holt alle Events, die noch genehmigt werden müssen
   */
  @Get('events/pending')
  async getPendingEvents() {
    console.log("ADMIN API: Get pending events");
    // MOCK:
    return Promise.resolve([
      { id: 99, title: "Event zur Genehmigung", status: 'PENDING', lat: 47.4, lon: 8.5, creator_id: 'user-123' }
    ]);
    // REAL: return this.adminService.findPendingEvents();
  }

  /**
   * Genehmigt ein Event
   */
  @Patch('events/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approveEvent(@Param('id') id: string) {
    console.log(`ADMIN API: Approve event ${id}`);
    // REAL: return this.adminService.setEventStatus(id, 'APPROVED');
    return Promise.resolve({ id, status: 'APPROVED' });
  }

  /**
   * Lehnt ein Event ab
   */
  @Patch('events/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectEvent(@Param('id') id: string) {
    console.log(`ADMIN API: Reject event ${id}`);
    // REAL: return this.adminService.setEventStatus(id, 'REJECTED');
    return Promise.resolve({ id, status: 'REJECTED' });
  }

  /**
   * Holt alle Benutzer, die 'CREATOR'-Rechte beantragt haben (Rolle = 'USER')
   */
  @Get('users/pending')
  async getPendingUsers() {
    console.log("ADMIN API: Get pending users");
    // MOCK:
    return Promise.resolve([
      { id: 'user-123', email: 'user@example.com', role: 'USER' }
    ]);
    // REAL: return this.adminService.findUsersWithRole('USER');
  }

  /**
   * Stuft einen Benutzer zum 'CREATOR' hoch
   */
  @Patch('users/:id/promote')
  @HttpCode(HttpStatus.OK)
  async promoteUser(@Param('id') userId: string) {
    console.log(`ADMIN API: Promote user ${userId} to CREATOR`);
    // REAL: return this.adminService.setUserRole(userId, 'CREATOR');
    return Promise.resolve({ id: userId, role: 'CREATOR' });
  }
}