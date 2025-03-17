import { appProcessAdminProcessTag, processBaseController, processTag } from '../open-api-builds/open-api.build';
import { ProcessGetAllDto } from '@applications/http/common/process/request/process-get-all.dto';
import { ProcessGetAllResponse } from '@applications/http/common/process/response/process-get-all.response';

export function ProcessCompile(): void {
  const processController = processBaseController.createController('', [processTag]);

  processController.addApiMethod('/all', {
    tags: [appProcessAdminProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить все процессы для текущего пользователя',
    description:
      'Все процессы, в которых текущий пользователь занимает какую-либо роль. <br>' +
      ' При фильтре <strong>ProcessGetAllByRoleEnum = all</strong> Администратор процессов видит все процессы системы',
    query: ProcessGetAllDto,
    responses: {
      '200': [ProcessGetAllResponse],
    },
  });
}
