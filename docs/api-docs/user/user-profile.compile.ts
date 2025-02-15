import { profileTag, userBaseController } from '../open-api-builds/open-api.build';
import { UserProfileStudentEducationResponse } from '@applications/http/user/profile/response/user-profile-student-education.response';

export function UserProfileCompile(): void {
  const userProfileController = userBaseController.createController('/profile', []);

  userProfileController.addApiMethod('student/education', {
    tags: [profileTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить информацию о текущем обучении текущего пользователя',
    description: 'Только для студентов ЛЭТИ',
    responses: {
      '200': [UserProfileStudentEducationResponse],
    },
  });
}
