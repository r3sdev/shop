import request from 'supertest';
import { app } from '../../app';


it('resturns a 404 on an unknown route', async () =>{
    await request(app).get('/docs/unknown').send().expect(404);
})
it('returns a 301 on auth', async () => {
  await request(app).get('/docs/auth').send().expect(301);
});
it('returns a 301 on orders', async () => {
  await request(app).get('/docs/orders').send().expect(301);
});
it('returns a 301 on payments', async () => {
  await request(app).get('/docs/payments').send().expect(301);
});
it('returns a 301 on tickets', async () => {
  await request(app).get('/docs/tickets').send().expect(301);
});
