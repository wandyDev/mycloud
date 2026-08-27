import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://mycloud.wandycruz.me',
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    a0f4c2306ea7e39778d56a335b60557dda1a3d22
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('My Cloud API')
    .setDescription('API documentation for My Cloud')
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('servers')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

<<<<<<< HEAD
  await app.listen(process.env.PORT || 3001);
  console.log(`Application is running on: ${process.env.PORT || 3001}`);

console.log('ENV CHECK:', {
  COOKIE_SECURE: process.env.COOKIE_SECURE,
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
});
=======
  await app.listen(process.env.PORT || 3007);
  console.log(`Application is running on: ${process.env.PORT || 3007}`);
>>>>>>> a0f4c2306ea7e39778d56a335b60557dda1a3d22
}
bootstrap();

