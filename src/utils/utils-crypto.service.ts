import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export class UtilsCryptoService {
  constructor(private config: ConfigService) {}

  public hashPassword = (password: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const { saltLen, keyLen, scryptParams } = this.config.get('hash');
      crypto.randomBytes(saltLen, (err, salt) => {
        if (err) {
          reject(err);
          return;
        }
        crypto.scrypt(password, salt, keyLen, scryptParams, (err, hash) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.serializeHash(hash, salt));
        });
      });
    });

  public validatePassword = (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    const { params, salt, hash } = this.deserializeHash(hashedPassword);
    return new Promise((resolve, reject) =>
      crypto.scrypt(
        password,
        salt,
        hash.length,
        params,
        (err, hashedPassword) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(crypto.timingSafeEqual(hashedPassword, hash));
        },
      ),
    );
  };

  private serializeHash = (hash: Buffer, salt: Buffer) => {
    const {
      scryptParams: { N, r, p, maxmem },
    } = this.config.get('hash');
    const saltString = salt.toString('base64').split('=')[0];
    const hashString = hash.toString('base64').split('=')[0];
    const scryptPrefix = `$scrypt$N=${N},r=${r},p=${p},maxmem=${maxmem}$`;
    return `${scryptPrefix}${saltString}$${hashString}`;
  };

  private deserializeHash = (phcString: string) => {
    const [, alg, options = '', salt64 = '', hash64 = ''] =
      phcString.split('$');
    if (alg !== 'scrypt') {
      throw new Error('Only scrypt supported');
    }
    const params = this.parseOptions(options);
    const salt = Buffer.from(salt64, 'base64');
    const hash = Buffer.from(hash64, 'base64');
    return { params, salt, hash };
  };

  private parseOptions = (options: string) => {
    const values: [string, number][] = [];
    const items = options.split(',');
    for (const item of items) {
      const [key = '', val] = item.split('=');
      values.push([key, Number(val)]);
    }
    return Object.fromEntries<number>(values);
  };
}
