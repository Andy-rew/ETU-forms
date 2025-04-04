import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';
import { AbstractDomainException } from '@app/exceptions/abstract-base-exceptions/abstract-domain-exception';
import { ApiTypeException } from '@applications/decorators/api/helpers/api-type-exception.decorator';
import { ApiMessageException } from '@applications/decorators/api/helpers/api-description-exception.decorator';

export class ValidationException extends AbstractDomainException {
  @ApiMessageException('Текст ошибки валидации', 'Validation error')
  message: string;

  @ApiTypeException(ExceptionTypeEnum.validation_error)
  type = ExceptionTypeEnum.validation_error;

  constructor(message?: string) {
    const messageText = message || 'Validation error';
    super(ExceptionTypeEnum.validation_error, messageText);
  }
}
