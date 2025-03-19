import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from '@applications/exceptions/exception-type.enum';

export abstract class AbstractForbiddenException extends HttpException {
  @IntProperty({
    description: 'Статус код ошибки',
    example: 403,
  })
  statusCode: HttpStatus.FORBIDDEN;

  constructor(type: ExceptionTypeEnum, message: string, additionalFields: object | null = null) {
    const error = {
      message,
      type,
      ...additionalFields,
      statusCode: HttpStatus.FORBIDDEN,
    };
    super(error, HttpStatus.FORBIDDEN);
  }
}
