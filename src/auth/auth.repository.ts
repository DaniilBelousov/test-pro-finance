import { Injectable, Inject } from '@nestjs/common';
import { type RedisClientType } from 'redis';
import { REDIS_TOKEN } from 'src/redis/redis.token';

@Injectable()
export class AuthRepository {
  private table = 'users';
  constructor(@Inject(REDIS_TOKEN) private readonly redis: RedisClientType) {}

  async save(refreshToken: string, expiresIn: number, userId: string) {
    this.redis.setEx(refreshToken, expiresIn, userId);
  }

  get(refreshToken: string) {
    return this.redis.get(refreshToken);
  }

  async remove(refreshToken: string) {
    this.redis.del(refreshToken);
  }
}
