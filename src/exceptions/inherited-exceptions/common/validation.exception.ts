import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';
import { AbstractDomainException } from '@app/exceptions/abstract-base-exceptions/abstract-domain-exception';
import { ApiTypeException } from '@applications/decorators/api/common/api-type-exception.decorator';
import { ApiMessageException } from '@applications/decorators/api/common/api-description-exception.decorator';

export class ValidationException extends AbstractDomainException {
  @ApiMessageException('Validation error')
  message: string;

  @ApiTypeException(ExceptionTypeEnum.validation_error)
  type = ExceptionTypeEnum.validation_error;

  constructor() {
    const messageText = 'Validation error';
    super(ExceptionTypeEnum.validation_error, messageText);
  }
}
