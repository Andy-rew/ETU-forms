import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ProcessBuilder } from '../../builders/process.builder';
import { StepBuilder } from '../../builders/step.builder';
import * as fs from 'node:fs/promises';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProcessStepApplyDto } from '@applications/http/user/participant/process/request/user-process-step-apply.dto';
import * as timekeeper from 'timekeeper';
import * as dayjs from 'dayjs';
import { StepUsersService } from '@domain/step/services/step-users.service';
import { ReactionBuilder } from '../../builders/reaction.builder';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';

@suite()
export class ParticipantProcessControllerTest extends BaseTestClass {
  @test()
  async viewProcess() {
    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/view')
      .query({
        processId: process.id,
      })
      .execute();

    expect(resView.status).toBe(200);
  }

  @test()
  async viewMyStepsProcess() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/my-steps')
      .query({
        processId: process.id,
      })
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.steps.length).toBe(1);
  }

  @test()
  async viewStepSchema() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/step/schema')
      .query({
        processId: process.id,
        stepId: step.id,
      })
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.id).toBeDefined();
  }

  @test()
  async applyForm() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    timekeeper.freeze(dayjs(step.startTime).add(2, 'hour').toDate());

    const body: UserProcessStepApplyDto = {
      processId: process.id,
      stepId: step.id,
      formSchemaId: schemaEntity.id,
      filledForm: filledSchema,
    };

    const res = await this.httpRequest()
      .withAuth(participant)
      .post('/user/participant/process/step/apply')
      .body(body)
      .execute();

    expect(res.status).toBe(201);
    timekeeper.reset();
  }

  @test()
  async viewFilledForm() {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);

    const fileFilled = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const filledSchema = JSON.parse(fileFilled);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    timekeeper.freeze(dayjs(step.startTime).add(2, 'hour').toDate());

    await this.app.get(StepUsersService).stepApply({
      processId: process.id,
      stepId: step.id,
      formSchemaId: schemaEntity.id,
      filledForm: filledSchema,
      user: participant,
    });

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/step/filled-form')
      .query({
        processId: process.id,
        stepId: step.id,
      })
      .execute();

    expect(resView.status).toBe(200);
    expect(resView.body.id).toBeDefined();

    timekeeper.reset();
  }

  @test()
  async viewReactionInfo() {
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

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    timekeeper.freeze(dayjs(step.startTime).add(2, 'hour').toDate());

    await this.app.get(StepUsersService).stepApply({
      processId: process.id,
      stepId: step.id,
      formSchemaId: schemaEntity.id,
      filledForm: filledSchema,
      user: participant,
    });

    const stepParticipant = step.participants[0];

    const reaction = await this.getBuilder(ReactionBuilder)
      .withFilledReactionForm(filledSchemaEntity)
      .withStepParticipant(stepParticipant)
      .build();

    stepParticipant.mainReaction = reaction;

    await this.app.get(StepParticipantsRepository).saveMany([stepParticipant]);

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/step/reaction/info')
      .query({
        processId: process.id,
        stepId: step.id,
      })
      .execute();

    expect(resView.status).toBe(200);

    timekeeper.reset();
  }

  @test()
  async viewReactionSchema() {
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

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    timekeeper.freeze(dayjs(step.startTime).add(2, 'hour').toDate());

    await this.app.get(StepUsersService).stepApply({
      processId: process.id,
      stepId: step.id,
      formSchemaId: schemaEntity.id,
      filledForm: filledSchema,
      user: participant,
    });

    const stepParticipant = step.participants[0];

    const reaction = await this.getBuilder(ReactionBuilder)
      .withFilledReactionForm(filledSchemaEntity)
      .withStepParticipant(stepParticipant)
      .build();

    stepParticipant.mainReaction = reaction;

    await this.app.get(StepParticipantsRepository).saveMany([stepParticipant]);

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/step/reaction/schema')
      .query({
        processId: process.id,
        stepId: step.id,
        reactionSchemaId: schemaEntity.id,
      })
      .execute();

    expect(resView.status).toBe(200);

    timekeeper.reset();
  }

  @test()
  async viewReactionSchemaFilled() {
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

    const participant = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const process = await this.getBuilder(ProcessBuilder).withParticipants([participant]).build();

    const step = await this.getBuilder(StepBuilder)
      .withProcess(process)
      .withFormSchema(schemaEntity)
      .withProcessParticipants(process.userParticipants)
      .build();

    timekeeper.freeze(dayjs(step.startTime).add(2, 'hour').toDate());

    await this.app.get(StepUsersService).stepApply({
      processId: process.id,
      stepId: step.id,
      formSchemaId: schemaEntity.id,
      filledForm: filledSchema,
      user: participant,
    });

    const stepParticipant = step.participants[0];

    const reaction = await this.getBuilder(ReactionBuilder)
      .withFilledReactionForm(filledSchemaEntity)
      .withStepParticipant(stepParticipant)
      .build();

    stepParticipant.mainReaction = reaction;

    await this.app.get(StepParticipantsRepository).saveMany([stepParticipant]);

    const resView = await this.httpRequest()
      .withAuth(participant)
      .get('/user/participant/process/step/reaction/filled')
      .query({
        processId: process.id,
        stepId: step.id,
        reactionFormFilledId: filledSchemaEntity.id,
      })
      .execute();

    expect(resView.status).toBe(200);

    timekeeper.reset();
  }
}
describe('', () => {});
