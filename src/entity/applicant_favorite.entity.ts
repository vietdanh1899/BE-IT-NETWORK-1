import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity('applicant_favorite')
export class ApplicantFavorite extends Base {
@PrimaryGeneratedColumn('uuid')
id: string

@Column({type: 'uuid'})
employerId: string;

@Column({type: 'uuid'})
applicantId: string;

@Column({type: 'uuid'})
jobId: string;
}