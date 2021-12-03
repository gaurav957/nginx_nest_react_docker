import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  responseErrors,
  responseMessages,
} from 'src/constant/message.constant';
import Role from 'src/enums/role.enum';
import { Cache } from 'cache-manager';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const redisAccessTokens = await this.cacheManager.store.get(
      'accessToken_' + user.email,
    );

    const rawAccessToken = request.headers.authorization;
    const accessToken = rawAccessToken.split(' ');
    accessToken.shift();

    const indexOfToken = redisAccessTokens.indexOf(accessToken[0]);

    if (indexOfToken > -1) {
      if (user.active && !user.deleted) {
        if (roles.includes(Role.KEY_ADMIN) && user.isKeyAdmin) {
          return true;
        } else if (roles.includes(Role.ADMIN) && user.isAdmin) {
          return true;
        } else if (
          roles.includes(Role.USER) &&
          !user.isAdmin &&
          !user.isKeyAdmin
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new BadRequestException(responseErrors.USER_DEACTIVATED);
      }
    } else {
      throw new BadRequestException(responseErrors.INVALID_TOKEN);
    }
  }
}
