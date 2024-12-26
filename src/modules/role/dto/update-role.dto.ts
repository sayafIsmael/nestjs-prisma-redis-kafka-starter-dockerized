import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string; 

  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}
