import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class AuthSignInDto {
  @EmailProperty()
  email: string;

  @TextProperty({ description: 'Пароль', minLength: 6, maxLength: 50 })
  password: string;
}
