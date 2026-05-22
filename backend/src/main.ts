import './config'; // Load environment variables first
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

const INSECURE_DEFAULTS = ['supersecret123', 'change_me_in_prod', 'REPLACE_WITH_SECURE_RANDOM_STRING'];

function validateEnv() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    console.error('FATAL: JWT_SECRET ist nicht gesetzt. Generiere einen sicheren Wert mit:\n  openssl rand -base64 64');
    process.exit(1);
  }
  if (INSECURE_DEFAULTS.includes(secret)) {
    console.error(`FATAL: JWT_SECRET ist auf einen unsicheren Default-Wert gesetzt ("${secret}"). Generiere einen sicheren Wert mit:\n  openssl rand -base64 64`);
    process.exit(1);
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Global exception filter — konsistentes Fehlerformat für alle Endpunkte
  app.useGlobalFilters(new AllExceptionsFilter());

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Bilder aus /uploads bleiben abrufbar
  }));

  // CORS — Origin aus ENV, kein hardcoded localhost
  const corsOrigin = process.env.CORS_ORIGIN;
  if (!corsOrigin) {
    logger.warn('CORS_ORIGIN ist nicht gesetzt — CORS ist deaktiviert.');
  }
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Backend läuft auf Port ${port}`);
}
bootstrap();
