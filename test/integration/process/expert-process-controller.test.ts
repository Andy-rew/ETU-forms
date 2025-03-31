import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { StepBuilder } from '../../builders/step.builder';
import * as fs from 'node:fs/promises';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessBuilder } from '../../builders/process.builder';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';
import { ExpertProcessStepsParticipantsReactionDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction.dto';
import { ExpertProcessStepsSchemaDto } from '@applications/http/user/expert/process/request/expert-process-steps-schema.dto';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { ExpertProcessStepsParticipantsFormDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-form.dto';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { ExpertProcessStepsParticipantsReactionAllDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-all.dto';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { ExpertProcessStepsParticipantsAddReactionDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-add-reaction.dto';
import { CommonReactionService } from '@domain/reaction/service/common-reaction.service';
import { ExpertProcessStepsParticipantsReactionMainDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-main.dto';

@suite()
export class ExpertProcessControllerTest extends BaseTestClass {
  @test()
  async viewProcessSuccess() {
    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder).withExperts([expert]).build();

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/view')
      .query({
        processId: step.process.id,
      })
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.id).toBe(step.process.id);
  }

  @test()
  async viewProcessStepsSuccess() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .build();

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/steps')
      .query({
        processId: step.process.id,
      })
      .execute();

    expect(resView.status).toBe(200);
  }

  @test()
  async viewProcessStepParticipantsSuccess() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participants = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .buildMany(10);

    const process = await this.getBuilder(ProcessBuilder).withParticipants(participants).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.participants.forEach((participant) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepParticipant = participant;
      stepExpertParticipant.stepExpert = step.experts[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/steps/participants')
      .query({
        processId: step.process.id,
        stepId: step.id,
        limit: 10,
        offset: 0,
      })
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.count).toBe(10);
  }

  @test()
  async viewProcessStepParticipantReactionSuccess() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participants = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .buildMany(10);

    const process = await this.getBuilder(ProcessBuilder).withParticipants(participants).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.participants.forEach((participant) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepParticipant = participant;
      stepExpertParticipant.stepExpert = step.experts[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const query: ExpertProcessStepsParticipantsReactionDto = {
      stepId: step.id,
      processId: step.process.id,
      userId: participants[0].id,
    };

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/steps/participants/reaction')
      .query(query)
      .execute();

    expect(resView.status).toBe(200);
  }

  @test()
  async viewProcessStepSchemaSuccess() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participants = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .buildMany(10);

    const process = await this.getBuilder(ProcessBuilder).withParticipants(participants).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.participants.forEach((participant) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepParticipant = participant;
      stepExpertParticipant.stepExpert = step.experts[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const query: ExpertProcessStepsSchemaDto = {
      stepId: step.id,
      processId: step.process.id,
      schemaId: schemaEntity.id,
    };

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/steps/schema')
      .query(query)
      .execute();

    expect(resView.status).toBe(200);
  }

  @test()
  async viewProcessStepsParticipantFilledForm() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const filledSchemaEntity = new FormSchemaFilledEntity();
    filledSchemaEntity.filledSchema = filledSchema;
    filledSchemaEntity.schema = schemaEntity;

    await this.app
      .get<Repository<FormSchemaFilledEntity>>(getRepositoryToken(FormSchemaFilledEntity))
      .save(filledSchemaEntity);

    const participants = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .buildMany(10);

    const process = await this.getBuilder(ProcessBuilder).withParticipants(participants).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.participants.forEach((participant) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepParticipant = participant;
      stepExpertParticipant.stepExpert = step.experts[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    step.participants[0].filledForm = filledSchemaEntity;

    await this.app
      .get<Repository<StepParticipantsEntity>>(getRepositoryToken(StepParticipantsEntity))
      .save(step.participants[0]);

    const query: ExpertProcessStepsParticipantsFormDto = {
      stepId: step.id,
      processId: step.process.id,
      schemaId: schemaEntity.id,
      formId: filledSchemaEntity.id,
    };

    const resView = await this.httpRequest()
      .withAuth(expert)
      .get('/user/expert/process/steps/participants/form')
      .query(query)
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.id).toBe(filledSchemaEntity.id);
  }

  @test()
  async viewProcessStepsParticipantReactionAll() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const expertsCount = 10;
    const filled: FormSchemaFilledEntity[] = [];
    for (let i = 0; i < expertsCount; i++) {
      const filledSchemaEntity = new FormSchemaFilledEntity();
      filledSchemaEntity.filledSchema = filledSchema;
      filledSchemaEntity.schema = schemaEntity;

      filled.push(filledSchemaEntity);
    }

    await this.app.get<Repository<FormSchemaFilledEntity>>(getRepositoryToken(FormSchemaFilledEntity)).save(filled);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();
    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const experts = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .buildMany(expertsCount);

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts(experts)
      .withIsMainExperts(true)
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    let i = 0;
    step.experts.forEach((expert) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepExpert = expert;
      stepExpertParticipant.stepParticipant = step.participants[0];

      const reaction = new ReactionEntity();
      reaction.type = ReactionTypeEnum.decline;
      reaction.stepParticipant = stepExpertParticipant.stepParticipant;
      reaction.reactionFormFilled = filled[i++];
      reaction.reactedByUser = expert.user;

      stepExpertParticipant.reaction = reaction;
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<ReactionEntity>>(getRepositoryToken(ReactionEntity))
      .save(stepExpertsParticipants.map((e) => e.reaction));

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const query: ExpertProcessStepsParticipantsReactionAllDto = {
      stepId: step.id,
      processId: step.process.id,
      userId: participant.id,
    };

    const resView = await this.httpRequest()
      .withAuth(experts[0])
      .get('/user/expert/process/steps/participants/reaction/all')
      .query(query)
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.reactions.length).toBe(expertsCount);
  }

  @test()
  async applyReaction() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const expertsCount = 10;
    const filled: FormSchemaFilledEntity[] = [];
    for (let i = 0; i < expertsCount; i++) {
      const filledSchemaEntity = new FormSchemaFilledEntity();
      filledSchemaEntity.filledSchema = filledSchema;
      filledSchemaEntity.schema = schemaEntity;

      filled.push(filledSchemaEntity);
    }

    await this.app.get<Repository<FormSchemaFilledEntity>>(getRepositoryToken(FormSchemaFilledEntity)).save(filled);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();
    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withIsMainExperts(true)
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.experts.forEach((expert) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepExpert = expert;
      stepExpertParticipant.stepParticipant = step.participants[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const body: ExpertProcessStepsParticipantsAddReactionDto = {
      stepId: step.id,
      processId: step.process.id,
      userId: participant.id,
      filledReaction: filledSchema,
      schemaId: schemaEntity.id,
      type: ReactionTypeEnum.decline,
    };

    const res = await this.httpRequest()
      .withAuth(expert)
      .post('/user/expert/process/steps/participants/reaction')
      .body(body)
      .execute();

    expect(res.status).toBe(201);
    expect(res.body.id).not.toBe(null);
  }

  @test()
  async setMainReaction() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const expertsCount = 10;
    const filled: FormSchemaFilledEntity[] = [];
    for (let i = 0; i < expertsCount; i++) {
      const filledSchemaEntity = new FormSchemaFilledEntity();
      filledSchemaEntity.filledSchema = filledSchema;
      filledSchemaEntity.schema = schemaEntity;

      filled.push(filledSchemaEntity);
    }

    await this.app.get<Repository<FormSchemaFilledEntity>>(getRepositoryToken(FormSchemaFilledEntity)).save(filled);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();
    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const expert = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder)
      .withFormSchema(schemaEntity)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withExperts([expert])
      .withIsMainExperts(true)
      .withProcess(process)
      .withProcessParticipants(process.userParticipants)
      .build();

    const stepExpertsParticipants = [];
    step.experts.forEach((expert) => {
      const stepExpertParticipant = new StepExpertsParticipantsEntity();
      stepExpertParticipant.stepExpert = expert;
      stepExpertParticipant.stepParticipant = step.participants[0];
      stepExpertsParticipants.push(stepExpertParticipant);
    });

    await this.app
      .get<Repository<StepExpertsParticipantsEntity>>(getRepositoryToken(StepExpertsParticipantsEntity))
      .save(stepExpertsParticipants);

    const reaction = await this.app.get(CommonReactionService).createReactionByUser({
      stepId: step.id,
      processId: step.process.id,
      userId: participant.id,
      filledReaction: filledSchema,
      schemaId: schemaEntity.id,
      type: ReactionTypeEnum.decline,
      userReactedBy: expert,
    });

    const body: ExpertProcessStepsParticipantsReactionMainDto = {
      stepId: step.id,
      processId: step.process.id,
      userId: participant.id,
      reactionId: reaction.id,
    };

    const res = await this.httpRequest()
      .withAuth(expert)
      .post('/user/expert/process/steps/participants/reaction/main')
      .body(body)
      .execute();

    expect(res.status).toBe(201);
  }
}
describe('', () => {});
