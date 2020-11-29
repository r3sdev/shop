import { InternalServerErrorException } from '@nestjs/common';

export class SomethingWentWrongException extends InternalServerErrorException {
    constructor(message?: any){
        super('Something went wrong', message)
    }
}