import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";

export class Item {
    @ApiHideProperty()
    _id: string;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    quantity: number;
}