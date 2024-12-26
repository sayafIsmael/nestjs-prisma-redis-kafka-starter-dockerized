import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}