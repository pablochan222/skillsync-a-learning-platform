import { LearnerGender } from "./gender-enum";
export class Learner{
    id : string;
    name : string;
    email : string;
    phone : string;
    password : string;
    gender? : LearnerGender;
    imageUrl? : string;
}
