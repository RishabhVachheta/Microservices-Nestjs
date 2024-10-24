// import { Controller, Get, Inject, InternalServerErrorException, Param } from '@nestjs/common';
// import { ClientProxy, MessagePattern } from '@nestjs/microservices';
// import {lastValueFrom} from 'rxjs';

// @Controller('api/users')
// export class UserController {
//   private users = [
//     { id: 1, name: 'John Doe' },
//     { id: 2, name: 'Adam smith' },
//   ];

//   constructor(
//     @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
//   ) {}
  
//     @MessagePattern({ cmd: 'get_users' })

//   @Get()
//   async getAllUsers(): Promise<any[]> { // Return type changed to Promise<any[]>
//     // Fetch all users and for each user, fetch their orders from the order microservice
//     const usersWithOrders = await Promise.all(this.users.map(async (user) => {
//       const orders = await this.getUserOrders(user.id); // Await the orders for each user
//       return { ...user, orders }; // Combine user and orders
//     }));

//     return usersWithOrders; // Return the final array of users with orders
//   }

//   @Get(':id')
//   async getUserById(@Param('id') id: number): Promise<any> { // Return type changed to Promise<any>
//     const user = this.users.find((u) => u.id === +id);
//     if (!user) {
//       throw new InternalServerErrorException('User not found');
//     }

//     const orders = await this.getUserOrders(id); // Await orders for the specific user
//     return { ...user, orders }; // Combine user and orders
//   }

//   // Method to call the order microservice and fetch orders for a user
//   async getUserOrders(userId: number): Promise<any> {
//     // Convert the Observable response from the microservice to a Promise
//     try {
//       const orders$ = this.orderServiceClient.send({ cmd: 'get_orders_by_user' }, { userId });
//       const orders = await lastValueFrom(orders$); // Convert Observable to Promise using lastValueFrom
//       return orders;
//     } catch (err) {
//       console.error('Order Service Down:', err);
//       return []; // Return an empty array if order service is unavailable
//     }
//   }
// }


import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return this.userService.getUsers(); // Fetch all users from the database
  }

  // Handle the message pattern to get a specific user by ID
  @MessagePattern({ cmd: 'get_user_by_id' })
  getUserById(@Payload() data: { id: number }) {
    return this.userService.getUserById(data.id); // Fetch user by ID
  }
  
}
