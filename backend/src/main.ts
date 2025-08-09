import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { CsrfService } from './csrf/csrf.service';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import Redis from 'ioredis';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import nextModule = require('next');
import { NextServer } from 'next/dist/server/next';
import { NextFunction, Request, Response } from 'express';

async function bootstrap(): Promise<void> {
  const PORT = Number(process.env.PORT) || 3000;
  const server = express();

  const dev = process.env.NODE_ENV !== 'production';
  const frontendDir = path.resolve(__dirname, '../../frontend');
  const next = nextModule as unknown as (opts: {
    dev: boolean;
    dir: string;
  }) => NextServer;
  const nextApp = next({ dev, dir: frontendDir });
  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  const redis = new Redis(
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  );
  redis.on('error', (err) => console.error('Redis Error:', err));

  server.use((req, res, nextMiddleware) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/swagger')) {
      return nextMiddleware();
    }
    return handle(req, res);
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const csrfService = app.get(CsrfService);

  app.use(helmet());
  app.enableCors({
    origin: [],
    credentials: true,
  });

  app.use(cookieParser(process.env.CSRF_SECRET ?? 'default_secret'));
  app.use((req: Request, res: Response, next: NextFunction) =>
    csrfService.doubleCsrfProtection(req, res, next),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('JunChirp')
    .setDescription('The JunChirp API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.init();
  server.listen(PORT, () => {
    console.log(`Server + Next ready on port ${PORT}`);
  });
}
bootstrap();
