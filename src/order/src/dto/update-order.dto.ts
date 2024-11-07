import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ description: 'The ID of the user placing the order' })
  userId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The item being ordered' })
  item?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ description: 'The quantity of the item' })
  quantity?: number;
}
