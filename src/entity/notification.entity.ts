import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Base } from './base.entity';
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    MaxLength,
    IsEmail,
    IsBoolean,
    IsPhoneNumber,
    IsIn,
    ValidateNested,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { User } from'./user.entity';
import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('notifications')
export class Notification extends Base {
    @PrimaryGeneratedColumn()
    id: number;
    
    @IsNotEmpty({ groups: [CREATE] })
    @IsOptional({ groups: [UPDATE] })
    @Column({ type: 'varchar', nullable: false })
    content: string

    @IsNotEmpty({ groups: [CREATE] })
    @Column({ type: 'json', nullable: false })
    params: object

    @ManyToMany(
        type => User,
        user => user.notifications
    )
    users: User[];
}
