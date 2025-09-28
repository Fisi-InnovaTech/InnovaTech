import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Uywa Backend API')
    .setDescription(
      'Sistema para la gestión y monitoreo de alertas contra el tráfico de fauna silvestre y doméstica en el Perú.',
    )
    .setVersion('1.0')
    .addTag('uywa')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
