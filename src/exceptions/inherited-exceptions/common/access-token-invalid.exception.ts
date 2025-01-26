import { AbstractUnauthorizedException } from '@app/exceptions/abstract-base-exceptions/abstract-unauthorized.exception';
import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';
import { ApiTypeException } from '@applications/decorators/api/helpers/api-type-exception.decorator';
import { ApiMessageException } from '@applications/decorators/api/helpers/api-description-exception.decorator';

export class AccessTokenInvalidException extends AbstractUnauthorizedException {
  @ApiMessageException('Access token invalid')
  message: string;

  @ApiTypeException(ExceptionTypeEnum.access_token_invalid_error)
  type: ExceptionTypeEnum.access_token_invalid_error;

  public constructor() {
    const message = 'Access token invalid';

    super(ExceptionTypeEnum.access_token_invalid_error, message);
  }
}
