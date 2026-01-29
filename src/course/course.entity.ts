import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Instructor } from "../instructor/instructor.entity";
import { CourseStatus } from "./course-status.enum";

@Entity('courses')
export class Course {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.PENDING })
    status: CourseStatus;

    @Column({default : false, nullable: true})
    isFeatured : boolean;

    @Column({ name: 'instructor_id' })
    instructorId: string;

    @ManyToOne(() => Instructor, instructor => instructor.courses)
    @JoinColumn({ name: 'instructor_id' })
    instructor: Instructor;

    @OneToMany('Enrollment', 'course')
    enrollments: any[];

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
