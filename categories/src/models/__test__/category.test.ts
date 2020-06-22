import { Category } from '../category';

it('implements optimistic concurrency control', async () => {
  // Create a product instance
  const category = Category.build({
    title: 'Test category',
    description: 'Test description',
    imageUrl: 'http://test.url/image.png'
  });

  // Save product to database
  await category.save();

  // Fetch product twice
  const categoryOne = await Category.findById(category.id);
  const categoryTwo = await Category.findById(category.id);

  // Make changes to fetched products
  categoryOne!.set({
    title: 'First update',
    description: 'Test update 1',
    imageUrl: 'http://test.url/update1.png',
  });

  categoryTwo!.set({
    title: 'Second update',
    description: 'Test update 2',
    imageUrl: 'http://test.url/update2.png',
  });

  // Save the first fetched product
  await categoryOne!.save();

  // Save the second fetched product and expect an error
  await expect(categoryTwo!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  // Create a product instance
  const category = Category.build({
    title: 'Test Category',
    description: 'Test update 1',
    imageUrl: 'http://test.url/update1.png',
  });

  await category.save();
  expect(category.version).toBe(0);

  await category.save();
  expect(category.version).toBe(1);

  await category.save();
  expect(category.version).toBe(2);
});
