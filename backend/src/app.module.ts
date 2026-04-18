// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { OrganizerModule } from './organizer/organizer.module';
import { EventModule } from './events/event.module';
import { AdminModule } from './admin/admin.module';
import { FlyerModule } from './flyer/flyer.module';
import { MailModule } from './mail/mail.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'mysql',
      password: process.env.DB_PASSWORD || 'mysql',
      database: process.env.DB_NAME || 'events',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: Number(process.env.THROTTLE_TTL_MS) || 60_000,
        limit: Number(process.env.THROTTLE_LIMIT) || 100,
      },
    ]),
    AuthModule,
    OrganizerModule,
    EventModule,
    AdminModule,
    FlyerModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
