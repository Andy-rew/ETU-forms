import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';

export abstract class AbstractDomainException extends HttpException {
  @IntProperty({
    description: 'Статус код ошибки',
    example: 400,
  })
  statusCode: HttpStatus.BAD_REQUEST;

  constructor(type: ExceptionTypeEnum, message: string, additionalFields: object | null = null) {
    const error = {
      message,
      type,
      ...additionalFields,
      statusCode: HttpStatus.BAD_REQUEST,
    };
    super(error, HttpStatus.BAD_REQUEST);
  }
}
