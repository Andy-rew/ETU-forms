import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { UserEntity } from '@domain/user/entities/user.entity';

export class SystemAdminUserInviteResponse {
  @IdProperty()
  id: number;

  @EnumApiProperty({ enum: UserStatusEnum, description: `Статус пользователя: ${UserStatusEnum.invited}` })
  status: UserStatusEnum;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.status = user.status;
  }
}
