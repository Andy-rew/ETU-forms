import { appExpertProcessTag, userBaseController } from '../open-api-builds/open-api.build';
import { ExpertProcessViewDto } from '@applications/http/user/expert/process/request/expert-process-view.dto';
import { ExpertProcessViewResponse } from '@applications/http/user/expert/process/response/expert-process-view.response';
import { ExpertProcessStepsDto } from '@applications/http/user/expert/process/request/expert-process-steps.dto';
import { ExpertProcessStepsResponse } from '@applications/http/user/expert/process/response/expert-process-steps.response';
import { ExpertProcessStepsParticipantsDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants.dto';
import { ExpertProcessStepsParticipantsResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants.response';
import { ExpertProcessStepsSchemaDto } from '@applications/http/user/expert/process/request/expert-process-steps-schema.dto';
import { ExpertProcessStepsSchemaResponse } from '@applications/http/user/expert/process/response/expert-process-steps-schema.response';
import { ExpertProcessStepsParticipantsFormDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-form.dto';
import { ExpertProcessStepsParticipantsFormResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-form.response';
import { ExpertProcessStepsParticipantsReactionDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction.dto';
import { ExpertProcessStepsParticipantsReactionResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-reaction.response';
import { ExpertProcessStepsParticipantsAddReactionDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-add-reaction.dto';
import { ExpertProcessStepsParticipantsAddReactionResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-add-reaction.response';
import { ExpertProcessStepsParticipantsReactionMainDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-main.dto';
import { ExpertProcessStepsParticipantsReactionAllDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-all.dto';
import { ExpertProcessStepsParticipantsReactionAllResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-reaction-all.response';

export function ExpertProcessCompile(): void {
  const expertController = userBaseController.createController('/expert/process', []);

  expertController.addApiMethod('/view', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить основную информацию о процессе',
    query: ExpertProcessViewDto,
    responses: {
      '200': [ExpertProcessViewResponse],
    },
  });

  expertController.addApiMethod('/steps', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить этапы',
    description: 'Получить этапы, в которых текущий пользователь принимает участие как эксперт',
    query: ExpertProcessStepsDto,
    responses: {
      '200': [ExpertProcessStepsResponse],
    },
  });

  expertController.addApiMethod('/steps/participants', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить всех участников этапа для которых текущий пользователь является экспертом',
    query: ExpertProcessStepsParticipantsDto,
    responses: {
      '200': [ExpertProcessStepsParticipantsResponse],
    },
  });

  expertController.addApiMethod('/steps/participants/reaction', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить информацию о реакции на этап',
    query: ExpertProcessStepsParticipantsReactionDto,
    responses: {
      '200': [ExpertProcessStepsParticipantsReactionResponse],
    },
  });

  expertController.addApiMethod('/steps/schema', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить шаблон формы этапа/реакции для заполнения',
    query: ExpertProcessStepsSchemaDto,
    responses: {
      '200': [ExpertProcessStepsSchemaResponse],
    },
  });

  expertController.addApiMethod('/steps/participants/form', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить заполненную форму этапа/реакции',
    query: ExpertProcessStepsParticipantsFormDto,
    responses: {
      '200': [ExpertProcessStepsParticipantsFormResponse],
    },
  });

  expertController.addApiMethod('/steps/participants/reaction', {
    tags: [appExpertProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Отправить реакцию на этап',
    requestBody: ExpertProcessStepsParticipantsAddReactionDto,
    responses: {
      '201': [ExpertProcessStepsParticipantsAddReactionResponse],
    },
  });

  expertController.addApiMethod('/steps/participants/reaction/main', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Выбрать реакцию на этап как основную',
    description: 'Только для ответственного эксперта',
    requestBody: ExpertProcessStepsParticipantsReactionMainDto,
    responses: {
      '201': [],
    },
  });

  expertController.addApiMethod('/steps/participants/reaction/all', {
    tags: [appExpertProcessTag],
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить все реакции на этап',
    description: 'Только для ответственного эксперта',
    query: ExpertProcessStepsParticipantsReactionAllDto,
    responses: {
      '200': [ExpertProcessStepsParticipantsReactionAllResponse],
    },
  });
}
