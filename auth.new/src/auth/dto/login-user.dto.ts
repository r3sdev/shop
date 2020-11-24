import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({ example: "test@test.com", description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: "password", description: 'The password of the user' })
    password: string;
}