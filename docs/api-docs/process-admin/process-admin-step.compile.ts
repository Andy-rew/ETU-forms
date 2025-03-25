import { appProcessAdminStepsTag, processAdminBaseController } from '../open-api-builds/open-api.build';
import { ProcessAdminGetAllProcessStepsDto } from '@applications/http/process-admin/step/request/process-admin-get-all-process-steps.dto';
import { ProcessAdminGetAllProcessStepsResponse } from '@applications/http/process-admin/step/response/process-admin-get-all-process-steps.response';
import { ProcessAdminCreateProcessStepResponse } from '@applications/http/process-admin/step/response/process-admin-create-process-step.response';
import { ProcessAdminCreateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-create-process-step.dto';
import { ProcessAdminDeleteProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-delete-process-step.dto';
import { ProcessAdminViewProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-view-process-step.dto';
import { ProcessAdminViewProcessStepResponse } from '@applications/http/process-admin/step/response/process-admin-view-process-step.response';
import { ProcessAdminUpdateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step.dto';
import { ProcessAdminProcessStepExpertMainDto } from '@applications/http/process-admin/step/request/process-admin-process-step-expert-main.dto';
import { ProcessAdminProcessStepParticipantsDto } from '@applications/http/process-admin/step/request/process-admin-process-step-participants.dto';
import { ProcessAdminProcessStepParticipantsResponse } from '@applications/http/process-admin/step/response/process-admin-process-step-participants.response';
import { ProcessAdminProcessStepParticipantFormDto } from '@applications/http/process-admin/step/request/process-admin-process-step-participant-form.dto';
import { ProcessAdminProcessStepParticipantFormResponse } from '@applications/http/process-admin/step/response/process-admin-process-step-participant-form.response';
import { ProcessAdminUpdateProcessStepSchemaDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step-schema.dto';

export function ProcessAdminStepCompile(): void {
  const processAdminStepController = processAdminBaseController.createController('/process/steps', []);

  processAdminStepController.addApiMethod('/all', {
    tags: [appProcessAdminStepsTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить все этапы процесса',
    query: ProcessAdminGetAllProcessStepsDto,
    responses: {
      '200': [ProcessAdminGetAllProcessStepsResponse],
    },
  });

  processAdminStepController.addApiMethod('/view', {
    tags: [appProcessAdminStepsTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить полную информацию об этапе процесса',
    query: ProcessAdminViewProcessStepDto,
    responses: {
      '200': [ProcessAdminViewProcessStepResponse],
    },
  });

  processAdminStepController.addApiMethod('/create', {
    tags: [appProcessAdminStepsTag],
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Создать новый этап процесса',
    description: 'Для первого этапа отправлять participantsCount = null',
    requestBody: ProcessAdminCreateProcessStepDto,
    responses: {
      '201': [ProcessAdminCreateProcessStepResponse],
    },
  });

  processAdminStepController.addApiMethod('/remove', {
    tags: [appProcessAdminStepsTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить  этап процесса',
    requestBody: ProcessAdminDeleteProcessStepDto,
    responses: {
      '201': [],
    },
  });

  processAdminStepController.addApiMethod('/edit', {
    tags: [appProcessAdminStepsTag],
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Обновить этап процесса',
    description: 'Отправлять старое значение, если оно не изменилось',
    requestBody: ProcessAdminUpdateProcessStepDto,
    responses: {
      '201': [],
    },
  });

  processAdminStepController.addApiMethod('/edit/schema', {
    tags: [appProcessAdminStepsTag],
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Обновить шаблон формы этапа процесса',
    requestBody: ProcessAdminUpdateProcessStepSchemaDto,
    responses: {
      '201': [],
    },
  });

  processAdminStepController.addApiMethod('/expert/main', {
    tags: [appProcessAdminStepsTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Сделать эксперта ответственным за этап процесса',
    requestBody: ProcessAdminProcessStepExpertMainDto,
    responses: {
      '201': [],
    },
  });

  processAdminStepController.addApiMethod('/participants', {
    tags: [appProcessAdminStepsTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить участников этапа',
    query: ProcessAdminProcessStepParticipantsDto,
    responses: {
      '200': [ProcessAdminProcessStepParticipantsResponse],
    },
  });

  processAdminStepController.addApiMethod('/participant-form', {
    tags: [appProcessAdminStepsTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить заполненную форму участника этапа(если есть) + реакция(если есть)',
    description: 'Получить заполненную форму и реакцию эксперта на нее по id участника этапа',
    query: ProcessAdminProcessStepParticipantFormDto,
    responses: {
      '200': [ProcessAdminProcessStepParticipantFormResponse],
    },
  });
}
