import mongoose from 'mongoose';
import { Product } from '../product';

it('implements optimistic concurrency control', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

  // Create a product instance
  const product = Product.build({
    id,
    title: 'Test category',
    price: 10,
    imageUrl: 'http://test.url/image.png',
  });

  // Save product to database
  await product.save();

  // Fetch product twice
  const productOne = await Product.findById(product.id);
  const productTwo = await Product.findById(product.id);

  // Make changes to fetched products
  productOne!.set({
    title: 'First update',
    price: 11,
    imageUrl: 'http://test.url/update1.png',
  });

  productTwo!.set({
    title: 'Second update',
    price: 12,
    imageUrl: 'http://test.url/update2.png',
  });

  // Save the first fetched product
  await productOne!.save();

  // Save the second fetched product and expect an error
  await expect(productTwo!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

  // Create a product instance
  const product = Product.build({
    id,
    title: 'Test Product',
    price: 11,
    imageUrl: 'http://test.url/update1.png',
  });

  await product.save();
  expect(product.version).toBe(0);

  await product.save();
  expect(product.version).toBe(1);

  await product.save();
  expect(product.version).toBe(2);
});
