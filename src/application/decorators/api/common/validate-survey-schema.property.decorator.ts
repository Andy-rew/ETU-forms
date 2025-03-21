import { registerDecorator, ValidationOptions } from 'class-validator';
import { JsonError, Model } from 'survey-core';
import { SurveySchemaValidationException } from '@applications/exceptions/survey-schema-validation.exception';

export function ValidateSurveySchema(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          const errors: JsonError[] = new Model(value).jsonErrors;
          if (errors && errors.length > 0) {
            throw new SurveySchemaValidationException(errors);
          }
          return true;
        },
      },
    });
  };
}
