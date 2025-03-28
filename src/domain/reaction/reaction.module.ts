import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity])],
  providers: [ReactionRepository],
  exports: [ReactionRepository],
})
export class ReactionModule {}
