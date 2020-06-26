import mongoose from 'mongoose';
import { Product } from '../product';
import { Category } from '../category';

it('implements optimistic concurrency control', async () => {
  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();

  // Create a product instance
  const product = Product.build({
    title: 'Test product',
    price: 10,
    cost: 5,
    category,
    userId: 'testUserId',
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
  });

  productTwo!.set({
    title: 'Second update',
    price: 12,
  });

  // Save the first fetched product
  await productOne!.save();

  // Save the second fetched product and expect an error
  await expect(productTwo!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  const category = Category.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test category',
  });

  await category.save();
  // Create a product instance
  const product = Product.build({
    title: 'Test Product',
    price: 10,
    cost: 5,
    category,
    userId: 'testUserId',
  });

  await product.save();
  expect(product.version).toBe(0);

  await product.save();
  expect(product.version).toBe(1);

  await product.save();
  expect(product.version).toBe(2);
});
