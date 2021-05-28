import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CV } from "./cv.entity";
import { Job } from "./job.entity";

@Entity()
export class JobToCv {
    @PrimaryGeneratedColumn()
    public jobToCvId!: number;

    @Column()
    public jobId!: number;

    @Column()
    public cvId!: number;

    @Column({default: false})
    public status!: boolean;

    @ManyToOne(() => Job, job => job.jobToCvs)
    public job!: Job;

    @ManyToOne(() => CV, cv => cv.jobToCvs)
    public cv!: CV;
}