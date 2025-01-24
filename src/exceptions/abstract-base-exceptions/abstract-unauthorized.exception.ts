import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';

export abstract class AbstractUnauthorizedException extends HttpException {
  @IntProperty({
    description: 'Статус код ошибки',
    example: 401,
  })
  statusCode: HttpStatus.UNAUTHORIZED;

  constructor(type: ExceptionTypeEnum, message: string, additionalFields: object | null = null) {
    const error = {
      message,
      type,
      ...additionalFields,
      statusCode: HttpStatus.UNAUTHORIZED,
    };
    super(error, HttpStatus.UNAUTHORIZED);
  }
}
