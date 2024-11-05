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
import { User } from '../user/src/user.entity';
import { Order } from '../order/src/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'ordersConnection',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get('DB1_HOST', '127.0.0.1'),
        port: configService.get<number>('DB1_PORT', 3306),
        username: configService.get('DB1_USERNAME', 'root'),
        password: configService.get('DB1_PASSWORD', ''),
        database: configService.get('DB1_NAME', 'orders_db'),
        entities:[Order],
        synchronize: true, 
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'usersConnection',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get('DB2_HOST', '127.0.0.1'),
        port: configService.get<number>('DB2_PORT', 3306),
        username: configService.get('DB2_USERNAME', 'root'),
        password: configService.get('DB2_PASSWORD', ''),
        database: configService.get('DB2_NAME', 'users_db'),
        entities:[User],
        synchronize: true, 
      }),
    }),
  ],
})
export class DatabaseModule {}
