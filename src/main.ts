import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có trường không định nghĩa
      transform: true, // Tự động chuyển đổi kiểu dữ liệu đầu vào
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
