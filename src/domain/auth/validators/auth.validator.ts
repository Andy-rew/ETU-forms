import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';

@Injectable()
export class AuthValidator {
  validateUserLogin(user: UserEntity) {
    if (user.status !== UserStatusEnum.activated) {
      throw new ValidationException('User is not activated. You Should register by link on your email');
    }

    if (user.deletedAt !== null) {
      throw new ValidationException('User is deleted. Contact admin for re-invite');
    }
  }
}
