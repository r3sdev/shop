import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({ example: "test@test.com", description: 'The email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password", description: 'The password of the user' })
    @IsString()
    @IsNotEmpty()
    password: string;
}