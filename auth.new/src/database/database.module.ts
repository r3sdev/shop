import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService): Promise<Db> => {
        try {
          const client = await MongoClient.connect(configService.get('database.uri'), {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          });

          const db = client.db(configService.get('database.name'));

          await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });

          return db;
        } catch (e) {
          throw e;
        }
      },
      inject: [ConfigService]
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}