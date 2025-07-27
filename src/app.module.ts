import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearnerModule } from './learner/learner.module';

@Module({
  imports: [LearnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
