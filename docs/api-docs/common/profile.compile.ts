import { profileBaseController, profileTag } from '../open-api-builds/open-api.build';
import { ProfileCommonResponse } from '@applications/http/common/profile/response/profile-common.response';
import { ProfileCommonEditDto } from '@applications/http/common/profile/request/profile-common-edit.dto';

export function ProfileCompile(): void {
  const profileController = profileBaseController.createController('', [profileTag]);

  profileController.addApiMethod('/common', {
    tags: [],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить общие данные профиля текущего пользователя',
    responses: {
      '200': [ProfileCommonResponse],
    },
  });

  profileController.addApiMethod('/common/edit', {
    tags: [],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Редактировать общие данные профиля текущего пользователя',
    requestBody: ProfileCommonEditDto,
    responses: {
      '201': [],
    },
  });
}
