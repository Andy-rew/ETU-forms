import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';

export class ProcessStatusResolveDto {
  id: string;
  realStatus: ProcessStatusEnum;
}
