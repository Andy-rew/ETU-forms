import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class AuthSignUpDto {
  @TextProperty({ description: 'Токен активации из ссылки в письме' })
  activationToken: string;

  @TextProperty({ description: 'Пароль', minLength: 6, maxLength: 50 })
  password: string;

  @TextProperty({ description: 'Такой же пароль для подтверждения', minLength: 6, maxLength: 50 })
  samePassword: string;
}
