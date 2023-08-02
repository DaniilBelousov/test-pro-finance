import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  private table = 'users';
  constructor(private readonly databaseService: DatabaseService) {}

  async save(createUserDto: CreateUserDto) {
    const { nickname, password } = createUserDto;
    const sql = `
        INSERT INTO ${this.table} (nickname, password)
        VALUES ($1, $2)
        RETURNING id;
      `;
    const { rows: [{ id }] = [] } = await this.databaseService.runQuery<{
      id: string;
    }>(sql, [nickname, password]);
    return id;
  }

  async get(options: { byField: [key: string, value: string] }) {
    const {
      byField: [key, value],
    } = options;
    const sql = `
      SELECT id, nickname, password
      FROM ${this.table}
      WHERE ${key} = $1;
    `;
    const {
      rows: [result],
    } = await this.databaseService.runQuery<{
      id: string;
      nickname: string;
      password: string;
    }>(sql, [value]);
    return result;
  }

  async getAll() {
    const sql = `
      SELECT *
      FROM ${this.table};
    `;
    const { rows: result } = await this.databaseService.runQuery<{
      id: string;
      nickname: string;
      password: string;
    }>(sql);
    return result;
  }
}
