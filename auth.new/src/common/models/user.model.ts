import { ApiProperty, ApiHideProperty, } from "@nestjs/swagger";
import { Expose } from 'class-transformer';

export class User {
    @ApiHideProperty()
    _id: string;

    @Expose()
    @ApiProperty({ example: "5fc33f1a4350e1ce20b2f803", description: "The user's id" })
    get id() {
        return this._id
    }

    @ApiProperty({ example: "user@tld.com", description: "The user's email address" })
    email: string;

    @ApiProperty({ example: "John", description: "The user's first name" })
    firstName: string;

    @ApiProperty({ example: "Doe", description: "The user's last name" })
    lastName: string;

    @ApiHideProperty()
    password: string;

    @Expose()
    @ApiProperty({ example: "John Doe", description: "The user's full name", readOnly: true })
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    toJSON() {
        const {_id, ...user} = this;

        delete user.password

        return {
            id: _id,
            ...user,
        }
    }
}