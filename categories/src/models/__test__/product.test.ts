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

it('should correctly set the id', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const product = Product.build({
    id,
    price: 10,
    title: 'Test',
  })

  await product.save();

  const newProduct =  await Product.findById(id);

  expect(newProduct!.toJSON().id == id).toBeTruthy()
})

it('should correctly return the correct version', async () => {

  const newProduct = Product.build({
    price: 1,
    title: 'Title 1'
  })

  await newProduct.save()

  newProduct.set({price: 2})
  await newProduct.save();
  
  newProduct.set({price: 3})
  await newProduct.save();

  newProduct.set({price: 4})
  await newProduct.save();

  expect(newProduct.version).toEqual(3)

  const product = await Product.findByEvent({
    id: newProduct.id,
    version: 4
  })

  expect(product!.id).toEqual(newProduct.id)
  expect(product!.version).toEqual(3)
})
