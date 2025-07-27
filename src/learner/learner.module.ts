import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';

@Module({
  providers: [LearnerService],
  controllers: [LearnerController]
})
export class LearnerModule {}
