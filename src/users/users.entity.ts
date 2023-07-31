import { Exclude } from 'class-transformer';

class Users {
  id: string;
  nickname: string;
  email: string;

  @Exclude()
  password: string;
}

export default Users;
