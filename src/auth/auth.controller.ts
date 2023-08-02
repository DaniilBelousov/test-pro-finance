import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from 'src/common/decorators';

@Controller()
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('/log-in')
  logIn(@Body() body: LogInDto) {
    return this.authService.logIn(body);
  }

  @Post('/refresh')
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body);
  }
}
