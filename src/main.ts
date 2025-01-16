import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import redoc from 'redoc-express';

export function setupRedoc(app: INestApplication) {
  const redocOptions = {
    title: 'Your API Title',
    version: '1.0',
    specUrl: '/docs-json',
  };

  app.use('/docs-redoc', redoc(redocOptions));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ETU-forms')
    .setDescription('The ETU-forms API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  setupRedoc(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
