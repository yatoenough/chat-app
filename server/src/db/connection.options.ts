import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ConnectionOptions: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'ytngh',
	password: 'infected666',
	database: 'chat-app-db',
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	synchronize: true,
};
