import { Injectable, Inject } from '@nestjs/common';
import { CONNECTION_POOL_TOKEN } from './database.module-definitions';
import { type Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject(CONNECTION_POOL_TOKEN) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown[]) {
    return this.pool.query(query, params);
  }
}
