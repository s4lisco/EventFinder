import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  const port = Number(process.env.PORT || 3001);
  const logger = new Logger('Bootstrap');

  try {
    await app.listen(port);
    logger.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    logger.error(`Failed to listen on port ${port}`, err as any);
    process.exit(1);
  }
}
bootstrap();