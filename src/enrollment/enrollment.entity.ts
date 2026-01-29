import { Course } from "src/course/course.entity";
import { Learner } from "src/learner/learner.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('enrollments')
export class Enrollment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    enrolled_at: Date;

    @Column({ name: 'course_id' })
    courseId: string;

    @Column({ name: 'learner_id' })
    learnerId: string;

    @ManyToOne(()=>Course, course=>course.enrollments)
    @JoinColumn({ name: 'course_id' })
    course: any;

    @ManyToOne(()=>Learner, learner=>learner.enrollments, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'learner_id' })
    learner: any;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
}
