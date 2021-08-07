import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Base } from './base.entity';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { User } from './user.entity';
import { CV } from './cv.entity';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('profiles')
export class Profile extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: false })
  name: string;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  profileUrl: string;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  pageURL: string;

  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  cvURL: string;

  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  introduction: string;

  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsPhoneNumber('VN US')
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'decimal', nullable: true })
  salaryRange: number;

  @Column({ type: 'integer', default: 0 })
  view: number;

  /** Relation to User */

  @OneToOne(
    type => User,
    user => user.profile,
  )
  user: User;


  @OneToMany(() => CV, cv => cv.profile)
  cvs: CV[];
}
