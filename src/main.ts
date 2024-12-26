import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, RequestMethod, VERSION_NEUTRAL, ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupSwagger } from './common/utils';
import { CorsConfig } from './config/config.interface';

async function bootstrap() {
  // Load environment variables from .env file
  const logger = new Logger();


  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');

  const port = process.env.PORT || 80;
  const app_debug = process.env.APP_DEBUG || false;

  app.use(cookieParser());
  app.useBodyParser('json', { limit: '20mb' });


  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'static'));


  // cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: "*",
    });
  }

  // app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );


  // Enable trust for the proxy
  app.getHttpAdapter().getInstance().set('trust proxy', true);


  // prefix
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'docs', method: RequestMethod.GET },
    ],
  });

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });


  // docs
  if (app_debug === 'true') {
    // Swagger
    setupSwagger(app);
  }

  // Log each request
  app.use((req: any, res: any, next: any) => {
    logger.log(`Request ${req.method} ${req.originalUrl}`);
    next();
  });

  (app as any).set('etag', false);

  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });


  logger.log(`Server running on http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
