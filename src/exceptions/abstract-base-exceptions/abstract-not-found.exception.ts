import { IntProperty } from '@ivankrtv/openapidoc/dist';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from '@app/exceptions/exception-type.enum';

export abstract class AbstractNotFoundException extends HttpException {
  @IntProperty({
    description: 'Статус код ошибки',
    example: 404,
  })
  statusCode: HttpStatus.NOT_FOUND;

  constructor(type: ExceptionTypeEnum, message: string, additionalFields: object | null = null) {
    const error = {
      message,
      type,
      ...additionalFields,
      statusCode: HttpStatus.NOT_FOUND,
    };
    super(error, HttpStatus.NOT_FOUND);
  }
}
