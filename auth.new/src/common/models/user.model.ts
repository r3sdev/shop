import { ApiProperty, ApiHideProperty,  } from "@nestjs/swagger";

export class User {
    @ApiHideProperty() 
    _id: string;

    @ApiProperty({example: "user@tld.com", description: "The user's email address"}) 
    email: string;

    @ApiProperty({description: "The user's full name"}) 
    fullName: string;
    
    @ApiHideProperty() 
    password: string;
}