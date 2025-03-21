import { Body, Controller, Post } from '@nestjs/common';
import { SystemAdminUserInviteDto } from '@applications/http/system-admin/user/request/system-admin-user-invite.dto';
import { CommonUserService } from '@domain/user/services/common-user.service';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { SystemAdminUserInviteResponse } from '@applications/http/system-admin/user/response/system-admin-user-invite.response';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

@MyApiOperation({
  roles: [UserRoleEnum.systemAdmin],
})
@Controller('system-admin/user')
export class SystemAdminUserController {
  constructor(private readonly commonUserService: CommonUserService) {}

  @Post('/invite')
  async invite(
    @Body() body: SystemAdminUserInviteDto,
    @ReqUser() user: UserEntity,
  ): Promise<SystemAdminUserInviteResponse> {
    const res = await this.commonUserService.invite({
      email: body.email,
      name: body.name,
      surname: body.surname,
      patronymic: body.patronymic,
      roles: body.roles,
      sender: user,
    });

    return new SystemAdminUserInviteResponse(res);
  }
}
