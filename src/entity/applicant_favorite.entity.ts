import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity('applicant_favorite')
export class ApplicantFavorite extends Base {
@PrimaryGeneratedColumn('uuid')
id: string

@Column()
employerId: string;

@Column()
applicantId: string;

@Column()
jobId: string;
}