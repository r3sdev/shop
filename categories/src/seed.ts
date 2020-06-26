import { Category } from './models/category';
import { CategoryCreatedPublisher } from './events/publishers/category-created-publisher';
import { natsWrapper } from './nats-wrapper';

export default async () => {
  console.log('Creating uncategorized category ... ');

  const categories = await Category.find({});

  if (categories.length === 0) {
    const category = Category.build({
      title: 'Uncategorized',
      description:
        'Uncategorized products will be automatically added to this category',
      imageUrl: '',
    });

    await category.save();

    console.log('Uncategorized category created!', category.id);

    new CategoryCreatedPublisher(natsWrapper.client).publish({
      id: category.id,
      description: category.description,
      imageUrl: category.imageUrl,
      title: category.title,
      version: 0,
    });
  } else {
    console.log('Database already contains data. Skipping seed.');
  }
};
