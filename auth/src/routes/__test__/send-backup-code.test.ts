import request from 'supertest';
import { app } from '../../app';

describe('send-backup-code', () => {
    const url = '/api/users/backup-code/send';

    it.todo('should throw an error when userId is missing');
    it.todo('should throw a 404 when user is not found');
    it.todo('should throw an error when phone number is not set');
    
})