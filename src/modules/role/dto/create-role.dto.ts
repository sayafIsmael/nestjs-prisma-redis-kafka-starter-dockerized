import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}
