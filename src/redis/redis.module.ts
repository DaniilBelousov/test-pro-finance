import { Module } from '@nestjs/common';
import * as redis from 'redis';

import { REDIS_TOKEN } from './redis.token';

@Module({
  providers: [
    {
      provide: REDIS_TOKEN,
      useFactory: async () => {
        const client = redis.createClient();
        client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class RedisModule {}
