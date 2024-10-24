import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get_orders_by_user' })
  getOrdersByUser(@Payload() data: { userId: number }) {
    return this.orderService.getOrdersByUser(data.userId);
  }

  @MessagePattern({ cmd: 'get_orders' })
  getOrders() {
    return this.orderService.getOrders();
  }
}
