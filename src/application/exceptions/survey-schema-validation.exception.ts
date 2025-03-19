import { HttpException, HttpStatus } from '@nestjs/common';
import { JsonError } from 'survey-core';

export class SurveySchemaValidationException extends HttpException {
  constructor(errors: JsonError[]) {
    const error = {
      message: 'Survey schema validation error',
      statusCode: HttpStatus.BAD_REQUEST,
      errors: errors.map((err) => ({ type: err.type, message: err.message })),
    };
    super(error, HttpStatus.BAD_REQUEST);
  }
}
