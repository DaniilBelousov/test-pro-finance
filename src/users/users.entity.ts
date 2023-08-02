import { Exclude } from 'class-transformer';

class Users {
  id: string;
  nickname: string;

  @Exclude()
  password?: string;
}

export default Users;
