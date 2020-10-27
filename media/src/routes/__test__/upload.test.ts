

import request from 'supertest';
import { app } from '../../app';
import path from 'path';

it('should return 401 when not logged in', async () => {

    beforeEach(() => {
        process.env.SPACES_KEY = "test";
        process.env.SPACES_SECRET = "test";
        process.env.CDN_URL = "https://www.test.com";
    })

    const response = await request(app)
        .post('/api/media/upload?kind=png')
        .field('file', 'file.png')
        .attach('file', path.join(__dirname, 'favicon.png'))

        // .send()
        .expect(400)

    expect(response.body.errors[0].message).toEqual("")
})