import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: "test@test.com", description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John", description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe", description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "password", description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
