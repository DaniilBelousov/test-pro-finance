import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';
import { CONNECTION_POOL_TOKEN } from './database.module-definitions';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: CONNECTION_POOL_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Pool({
          host: config.get<string>('db.host'),
          port: config.get<number>('db.number'),
          user: config.get<string>('db.username'),
          database: config.get<string>('db.database'),
          password: config.get<string>('db.password'),
        }),
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
