import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from '@applications/exceptions/exception-type.enum';

export abstract class AbstractInternalException extends HttpException {
  @IntProperty({
    description: 'Статус код ошибки',
    example: 500,
  })
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(type: ExceptionTypeEnum, message: string, additionalFields: object | null = null) {
    const error = {
      message,
      type,
      ...additionalFields,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    super(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
