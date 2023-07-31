import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  private table = 'users';
  constructor(private readonly databaseService: DatabaseService) {}

  save(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;
    const sql = `
        INSERT INTO ${this.table} (email, password, nickname)
        VALUES ($1, $2, $3);
      `;
    return this.databaseService.runQuery(sql, [email, password, nickname]);
  }
}
