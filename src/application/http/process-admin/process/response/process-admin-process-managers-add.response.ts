import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';

export class ProcessAdminProcessManagersAddResponse {
  @ArrayPrimitiveProperty({ items: 'email' })
  errorEmails: string[];

  @ArrayPrimitiveProperty({ items: 'email' })
  invitedEmails: string[];
}
