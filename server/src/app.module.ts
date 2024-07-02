import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from './db/connection.options';

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
		TypeOrmModule.forRoot(ConnectionOptions),
	],
})
export class AppModule {}
