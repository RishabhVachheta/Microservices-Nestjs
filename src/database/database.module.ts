// // config/database.config.ts
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { User } from '../user/src/user.entity';
// import { Order } from '../order/src/order.entity';

// export const databaseConfig = (): TypeOrmModuleOptions => ({
//   type: 'mysql',  // or whatever DB you're using
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT) || 3306,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

//   entities: [User, Order], // Register both User and Order entities
//   synchronize: true, // Don't use in production - instead use migrations
// });


// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASS', ''),
        database: configService.get('DB_NAME', 'microservices_db'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, 
      }),
    }),
  ],
})
export class DatabaseModule {}
