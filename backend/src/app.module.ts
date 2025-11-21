import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Event } from './events/entities/event.entity';
import { Location } from './events/entities/location.entity';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Event, Location, User], // ensure all entity classes are listed
      synchronize: false,
      migrationsRun: true,
      migrations: ['dist/migrations/*.js'],
    }),
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
