import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const scheme = configService.get('server.scheme');
  const host = configService.get('server.host');
  const port = configService.get('server.port')

  const options = new DocumentBuilder()
    .setTitle('Items example')
    .setDescription('The Items API description')
    .setVersion('0.0.1')
    .addTag('items')
    .setTermsOfService('http://www.ramsy.it/tos.html')
    .setContact('Ramsy IT', 'http://www.ramsy.it', 'ramsy@ramsy.it')
    .addServer(`${scheme}://${host}:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
