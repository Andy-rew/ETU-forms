import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDepartmentsRepository {
  constructor(@InjectRepository(UserDepartmentsEntity) private readonly repo: Repository<UserDepartmentsEntity>) {}
}
