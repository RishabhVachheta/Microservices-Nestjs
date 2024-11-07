import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the user placing the order' })
  userId: number;  

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The item being ordered' })
  item: string;  

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The quantity of the item' })
  quantity: number;  
}
