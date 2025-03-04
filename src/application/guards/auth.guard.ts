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
import { UserRepository } from '@domain/user/repository/user.repository';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@applications/decorators/auth-roles.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthJwtAccessTokenService') private readonly jwtService: JwtService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

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

    const user = await this.userRepository.findByIdForAuth(basePayload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!requiredRoles.some((role) => user.roles.includes(role))) {
      throw new UnauthorizedException('User does not have required role');
    }

    if (user.status !== UserStatusEnum.activated) {
      throw new UnauthorizedException('User is not activated');
    }

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
