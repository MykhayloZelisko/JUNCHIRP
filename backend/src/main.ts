import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import nextModule = require('next');
import { NextServer } from 'next/dist/server/next';

async function bootstrap() {
  const next = nextModule as unknown as (opts: {
    dev: boolean;
    dir: string;
  }) => NextServer;
  const dev = process.env.NODE_ENV !== 'production';
  const frontendDir = path.resolve(__dirname, '../../frontend');
  const nextApp = next({ dev, dir: frontendDir });
  await nextApp.prepare();

  const server = express();
  const handle = nextApp.getRequestHandler();

  server.use((req, res, nextMiddleware) => {
    const url = req.url;

    if (url.startsWith('/api') || url.startsWith('/swagger')) {
      return nextMiddleware();
    }

    return handle(req, res);
  });

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  await nestApp.init();

  const PORT = parseInt(process.env.PORT || '3000');
  server.listen(PORT, () => {
    console.log(`Ready on http://localhost:${PORT}`);
  });
}
bootstrap();
