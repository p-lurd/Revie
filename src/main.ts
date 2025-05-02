import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: true, //configService.get<string>('allowedOrigins') || '*',(In case of prodduction and multiple origins)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(configService.get<string>('PORT') || 3000);
  console.log(`server running on port:${configService.get<string>('PORT')}`);
}
bootstrap();
