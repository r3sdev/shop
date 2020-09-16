import request from 'supertest';
import {app} from '../app';

it('should return 404 on non existing route', async () => {
    await request(app)
    .get('/not/existing')
    .send()
    .expect(404)
})