import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@applications/decorators/auth-roles.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthJwtAccessTokenService') private readonly jwtService: JwtService,
    @Inject(UserAuthTokensRepository) private readonly userAuthTokensRepository: UserAuthTokensRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    let basePayload: CommonAuthPayload;

    try {
      basePayload = await this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      throw new UnauthorizedException();
    }

    const userAuthToken = await this.userAuthTokensRepository.findByAccessTokenAndUserIdOrFail({
      accessToken,
      userId: basePayload.id,
    });

    if (!userAuthToken) {
      throw new NotFoundException('User for token not found');
    }

    const user = await userAuthToken.user;

    if (user.status !== UserStatusEnum.activated) {
      throw new UnauthorizedException('User is not activated');
    }

    if (!requiredRoles.length) {
      request['user'] = user;
      request['token'] = userAuthToken;
      return true;
    }

    if (!requiredRoles.some((role) => user.roles.includes(role))) {
      throw new UnauthorizedException('User does not have required role');
    }

    request['user'] = user;
    request['token'] = userAuthToken;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
