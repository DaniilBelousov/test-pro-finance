import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';
import { UsersRepository } from 'src/users/users.repository';
import { UtilsCryptoService } from 'src/utils/utils-crypto.service';
import { AuthRepository } from './auth.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private authRepository: AuthRepository,
    private utilsCryptoService: UtilsCryptoService,
    private usersRepository: UsersRepository,
  ) {}

  async signUp(body: SignUpDto) {
    const { nickname, password } = body;
    const user = await this.usersRepository.get({
      byField: ['nickname', nickname],
    });
    if (user) {
      throw new ForbiddenException();
    }
    const hashedPassword = await this.utilsCryptoService.hashPassword(password);
    const id = await this.usersRepository.save({
      ...body,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = await this.issueTokens(id, nickname);
    await this.saveRefreshToken(refreshToken, id);
    return { accessToken, refreshToken };
  }

  async logIn(body: LogInDto) {
    const { nickname, password } = body;
    const user = await this.usersRepository.get({
      byField: ['nickname', nickname],
    });
    if (!user) {
      throw new NotFoundException();
    }
    const { password: hashedPassword } = user;
    const isValid = await this.utilsCryptoService.validatePassword(
      password,
      hashedPassword,
    );
    if (!isValid) {
      throw new BadRequestException();
    }
    const { accessToken, refreshToken } = await this.issueTokens(
      user.id,
      nickname,
    );
    await this.saveRefreshToken(refreshToken, user.id);
    return { accessToken, refreshToken };
  }

  async refresh(body: RefreshDto) {
    const { refreshToken } = body;
    const userId = await this.authRepository.get(refreshToken);
    const user = await this.usersRepository.get({ byField: ['id', userId] });
    if (!userId || !user) {
      throw new UnauthorizedException();
    }
    await this.authRepository.remove(refreshToken);
    const { accessToken, refreshToken: nextRefreshToken } =
      await this.issueTokens(user.id, user.nickname);
    this.saveRefreshToken(nextRefreshToken, userId);
    return { accessToken, refreshToken: nextRefreshToken };
  }

  private async saveRefreshToken(token: string, userId: string) {
    const { refreshExpiresIn } = this.config.get('jwt');
    const expiresIn = 60 * 60 * 24 * 30 * refreshExpiresIn;
    await this.authRepository.save(token, expiresIn, userId);
  }

  private async issueTokens(userId: string, nickname: string) {
    const accessToken = await this.jwt.signAsync({
      sub: userId,
      nickname: nickname,
    });
    const refreshToken = crypto.randomUUID();
    return { accessToken, refreshToken };
  }
}
