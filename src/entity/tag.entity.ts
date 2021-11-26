import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Base } from './base.entity';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { Job } from './job.entity';
const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('tags')
export class Tag extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'nvarchar', unique: true })
  @Index()
  name: string;

  // @ManyToOne(
  //   type => User,
  //   user => user.tags,
  // )
  // author: User;

  @ManyToMany(
    () => Job,
    job => job.tags,
  )
  jobs: Job[];
}