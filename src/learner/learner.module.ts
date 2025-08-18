import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from './learner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Learner])],
  providers: [LearnerService],
  controllers: [LearnerController],
  exports : [LearnerService]
})
export class LearnerModule {}
