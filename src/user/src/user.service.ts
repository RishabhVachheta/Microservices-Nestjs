// // src/user/user.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }

//   async findOne(id: number): Promise<User> {
//     return this.userRepository.findOne({ where: { id } });
//   }
// }


import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './user.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy,  // Injecting the TCP client
  ) {}

  async getUsers(): Promise<any[]> {
    const users = await this.userRepository.find();

    // For each user, try to fetch their orders
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        try {
          const orders = await lastValueFrom(
            this.orderServiceClient.send({ cmd: 'get_orders_by_user' }, { userId: user.id })
          );
          return { ...user, orders }; // Include orders in the response
        } catch (error) {
          console.error('Error fetching orders for user:', user.id, error);
          return { ...user, orders: [] }; // Return user without orders if the service is down
        }
      })
    );

    return usersWithOrders;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Request orders from the Order service
    let orders;
    try {
      orders = await lastValueFrom(
        this.orderServiceClient.send({ cmd: 'get_orders_by_user' }, { userId: id })
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new HttpException('Could not fetch orders', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      ...user,
      orders,  // Include orders in the response
    };
  }
}


