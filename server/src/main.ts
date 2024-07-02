import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port = +process.env.PORT || 2999;

	const config = new DocumentBuilder()
		.setTitle('Chat API')
		.setDescription('Chat app realtime API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use(helmet());
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.setGlobalPrefix('/api');
	console.log('PORT:' + port);

	await app.listen(port);
}
bootstrap();
