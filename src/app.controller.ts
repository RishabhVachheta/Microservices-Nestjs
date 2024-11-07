import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from './order/src/order.entity';
import { User } from './user/src/user.entity';

@Controller('api')
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', type: [User] })
  @ApiBadRequestResponse({ description: 'users not found'  })
  getUsers(): Observable<any> {
    return this.userServiceClient.send({ cmd: 'get_users' }, {}).pipe(
      catchError((err) => {
        console.error('Error fetching users:', err);
        throw new InternalServerErrorException('Failed to fetch users');
      }),
    );
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  getOrders(): Observable<any> {
    return this.orderServiceClient.send({ cmd: 'get_orders' }, {}).pipe(
      catchError((err) => {
        console.error('Error fetching orders:', err);
        throw new InternalServerErrorException('Failed to fetch orders');
      }),
    );
  }
}
