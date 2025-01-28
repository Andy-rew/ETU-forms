import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';

export class ProcessAdminProcessUsersAddResponse {
  @ArrayPrimitiveProperty({ items: 'email' })
  errorEmails: string[];

  @ArrayPrimitiveProperty({ items: 'email' })
  invitedEmails: string[];
}
