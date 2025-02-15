import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';

export class ProfileCommonEditDto {
  @TextProperty()
  name: string;

  @TextProperty()
  surname: string;

  @TextProperty({ nullable: true })
  patronymic: string | null;

  @EmailProperty()
  email: string;
}
