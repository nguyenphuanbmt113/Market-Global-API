import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(function (req, res, next) {
    //allow cross origin requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'POST, HEAD, PUT, OPTIONS, DELETE, GET',
    );
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
  await app.listen(3100);
}
bootstrap();
