import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow requests from Play Framework frontend
  app.enableCors({
    origin: ['http://localhost:9000', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 NestJS application is running on: http://localhost:${port}`);
  logger.log(`📝 API endpoint: http://localhost:${port}/api/tasks`);
  logger.log(
    `🔄 Ready to handle POST /api/tasks alongside Play Framework`,
  );
}
bootstrap();
