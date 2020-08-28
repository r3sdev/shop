import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

const setup = async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'Password12341!',
      passwordConfirmation: 'Password12341!',
      fullName: "Jest Test"
    })
    .expect(200)
}

it('should return a 201 on successful signin', async () => {
  await setup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'Password12341!',
    })
    .expect(200)

});

it('returns a 400 with an invalid email', async () => {
  await setup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test',
      password: 'Password12341!',
    })
    .expect(400);
});

it('should return a 400 with an invalid password', async () => {
  await setup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('should return a 400 with missing email/password', async () => {
  await setup();

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signin')
    .send({ password: 'Password12341!' })
    .expect(400);
});

it('should return a 400 when the user is unknown', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({ email: 'test@test.com', password: 'Password12341!' })
  .expect(400);
})

it('should set a cookie after successful signin and 2FA is disabled', async () => {

  await setup()

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'Password12341!',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should not set a cookie when 2FA is enabled', async () => {
  await setup()

  const user = await User.findOne({email: 'test@test.com'});

  user!.set({twoFactorAuthEnabled: true});

  await user!.save()

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'Password12341!',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeUndefined();
})