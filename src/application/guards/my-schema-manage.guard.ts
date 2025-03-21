import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { FormSchemaUserTemplateRepository } from '@domain/form-schema/repository/form-schema-user-template.repository';

@Injectable()
export class MySchemaManageGuard implements CanActivate {
  constructor(
    @Inject(FormSchemaUserTemplateRepository)
    private readonly formSchemaUserTemplateRepository: FormSchemaUserTemplateRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user: UserEntity = request['user'];

    if (!user) {
      throw new ValidationException('No user in request');
    }

    const schemaId = request.query['schemaId'] || request.body['schemaId'];

    if (!schemaId) {
      throw new ValidationException('Parameter "schemaId" is required in query or body');
    }

    try {
      await this.formSchemaUserTemplateRepository.findByUserIdAndSchemaIdOrFail({
        userId: user.id,
        schemaId: Number(schemaId),
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return true;
  }
}
