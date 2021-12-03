import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LeanDocument } from 'mongoose';
import { UserDocument } from '../../../user/user.schema';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { responseMessages } from 'src/constant/message.constant';
@Injectable()
export class CryptoService {
  constructor(private readonly jwtService: JwtService) {}
  generateJWTAccessToken(user: LeanDocument<UserDocument>) {
    const payload = {
      _id: user._id,
      active: user.active,
      isAdmin: user.isAdmin,
      isKeyAdmin: user.isKeyAdmin,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  hashPassword = (text: string) => bcrypt.hash(text, 10);

  comparePasswordHash = (password: string, hashedPassword: string) =>
    bcrypt.compare(password, hashedPassword);

  generateRandomToken = () => randomBytes(32).toString('hex');

  fetchJwtFromReq(req: any) {
    const rawHashedToken = req.headers.authorization;
    if (req.user.email == undefined || rawHashedToken == undefined) {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }

    let hashedToken;
    if (rawHashedToken.match('bearer')) {
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
  }
}
