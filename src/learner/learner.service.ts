import { Injectable } from '@nestjs/common';
import { LearnerDto } from './dto/learner.dto';

@Injectable()
export class LearnerService {
    async createLearner(learnerDto : LearnerDto) : Promise<LearnerDto>{
        return learnerDto;
    }

}
