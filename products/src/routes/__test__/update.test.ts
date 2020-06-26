import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

it('returns a 404 if the provided id does not exist', async () => {
  const cookie = global.signin({ isAdmin: true });

  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 50,
      categoryId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 if the provided user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${id}`)
    .send({
      title: 'test',
      price: 10,
      cost: 50,
      categoryId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(401);
});

it('returns a 401 of the user does not own the product', async () => {
  const cookie = global.signin({ isAdmin: true });

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
      cost: 10,
      categoryId: category.id,
    })
    .expect(201);

  const categoryTwo = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await categoryTwo.save();

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'update',
      price: 10,
      cost: 5,
      categoryId: categoryTwo.id,
    })
    .expect(401);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();

  // Ensure the product is not updated
  expect(productResponse.body.title).toEqual('test');
  expect(productResponse.body.price).toEqual(20);
  expect(productResponse.body.cost).toEqual(10);
  expect(productResponse.body.category.id).toEqual(category.id);
});

it('returns a 400 if user does not provide a valid title or price', async () => {
  const cookie = global.signin({ isAdmin: true });
  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 5,
      categoryId: category.id,
    })
    .expect(201);

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
    })
    .expect(400);
  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);
});

it('update the product provided valid input', async () => {
  // Construct a cookie
  const cookie = global.signin({ isAdmin: true });
  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  // Create a product
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 5,
      categoryId: category.id,
    })
    .expect(201);

  // Update the product
  const title = 'new test';
  const price = 100;
  const cost = 50;

  const categoryTwo = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await categoryTwo.save();

  const updateResponse = await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price, cost, categoryId: categoryTwo.id })
    .expect(200);

  // Update should return updated product
  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.price).toEqual(price);
  expect(updateResponse.body.cost).toEqual(cost);
  expect(updateResponse.body.category.id).toEqual(categoryTwo.id);

  // Get the updated product
  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
});

it('publishes an event', async () => {
  // Construct a cookie
  const cookie = global.signin({ isAdmin: true });

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  // Create a product
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 5,
      categoryId: category.id,
    })
    .expect(201);

  // Update the product
  const title = 'new test';
  const price = 100;
  const cost = 50;
  const categoryTwo = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await categoryTwo.save();

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price, cost, categoryId: categoryTwo.id })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    'product:updated',
    expect.any(String),
    expect.any(Function),
  );
});

it('rejects updates if the product is reserved', async () => {
  // Construct a cookie
  const cookie = global.signin({ isAdmin: true });

  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  // Create a product
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
      cost: 5,
      categoryId: category.id,
    })
    .expect(201);

  const product = await Product.findById(response.body.id);

  product!.set({ orderId: mongoose.Types.ObjectId().toHexString() });

  await product!.save();

  const categoryTwo = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await categoryTwo.save();

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new',
      price: 10,
      cost: 1,
      categoryId: categoryTwo.id,
    })
    .expect(400);
});
