import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '@domain/file/entities/file.entity';
import { FileRepository } from '@domain/file/repository/file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileRepository],
  exports: [FileRepository],
})
export class FileModule {}
