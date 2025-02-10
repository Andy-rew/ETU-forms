import { appUserProcessTag, userBaseController } from '../open-api-builds/open-api.build';
import { UserProcessViewDto } from '@applications/http/user/process/request/user-process-view.dto';
import { UserProcessViewResponse } from '@applications/http/user/process/response/user-process-view.response';
import { UserProcessMyStepsDto } from '@applications/http/user/process/request/user-process-my-steps.dto';
import { UserProcessMyStepsResponse } from '@applications/http/user/process/response/user-process-my-steps.response';
import { UserProcessStepSchemaResponse } from '@applications/http/user/process/response/user-process-step-schema.response';
import { UserProcessStepSchemaDto } from '@applications/http/user/process/request/user-process-step-schema.dto';
import { UserProcessStepApplyDto } from '@applications/http/user/process/request/user-process-step-apply.dto';
import { UserProcessStepReactionDto } from '@applications/http/user/process/request/user-process-step-reaction.dto';
import { UserProcessStepReactionResponse } from '@applications/http/user/process/response/user-process-step-reaction.response';
import { UserProcessStepFormFilledDto } from '@applications/http/user/process/request/user-process-step-form-filled.dto';
import { UserProcessStepFormFilledResponse } from '@applications/http/user/process/response/user-process-step-form-filled.response';
import { UserProcessStepReactionSchemaDto } from '@applications/http/user/process/request/user-process-step-reaction-schema.dto';
import { UserProcessStepReactionSchemaResponse } from '@applications/http/user/process/response/user-process-step-reaction-schema.response';
import { UserProcessStepReactionSchemaFilledDto } from '@applications/http/user/process/request/user-process-step-reaction-schema-filled.dto';
import { UserProcessStepReactionSchemaFilledResponse } from '@applications/http/user/process/response/user-process-step-reaction-schema-filled.response';

export function UserProcessCompile(): void {
  const processAdminUserController = userBaseController.createController('/process', []);

  processAdminUserController.addApiMethod('/view', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить основную информацию о процессе',
    query: UserProcessViewDto,
    responses: {
      '200': [UserProcessViewResponse],
    },
  });

  processAdminUserController.addApiMethod('/my-steps', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить мои этапы процесса',
    description: 'Получить этапы, на которые прошел текущий пользователь (участник)',
    query: UserProcessMyStepsDto,
    responses: {
      '200': [UserProcessMyStepsResponse],
    },
  });

  processAdminUserController.addApiMethod('/step/schema', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить шаблон формы этапа для заполнения',
    query: UserProcessStepSchemaDto,
    responses: {
      '200': [UserProcessStepSchemaResponse],
    },
  });

  processAdminUserController.addApiMethod('/step/filled-form', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить заполненную форму этапа',
    query: UserProcessStepFormFilledDto,
    responses: {
      '200': [UserProcessStepFormFilledResponse],
    },
  });

  processAdminUserController.addApiMethod('/step/apply', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Отправить заполненную форму этапа',
    requestBody: UserProcessStepApplyDto,
    responses: {
      '201': [],
    },
  });

  processAdminUserController.addApiMethod('/step/reaction/info', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить информацию о реакции эксперта на заполненную форму этапа',
    description: 'Приходит основная информация о реакции, которая отмечена ответственным экспертом как основная',
    query: UserProcessStepReactionDto,
    responses: {
      '200': [UserProcessStepReactionResponse],
    },
  });

  processAdminUserController.addApiMethod('/step/reaction/schema', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить шаблон главной реакции реакции эксперта на заполненную форму этапа',
    query: UserProcessStepReactionSchemaDto,
    responses: {
      '200': [UserProcessStepReactionSchemaResponse],
    },
  });

  processAdminUserController.addApiMethod('/step/reaction/filled', {
    tags: [appUserProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить заполненный шаблон главной реакции реакции эксперта на заполненную форму этапа',
    query: UserProcessStepReactionSchemaFilledDto,
    responses: {
      '200': [UserProcessStepReactionSchemaFilledResponse],
    },
  });
}
