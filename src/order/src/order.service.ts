import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  getOrders() {
    return this.orderRepository.find();  // Fetch all orders from the database
  }

  getOrdersByUser(userId: number) {
    return this.orderRepository.find({ where: { userId } });  // Fetch orders for a specific user
  }
}
