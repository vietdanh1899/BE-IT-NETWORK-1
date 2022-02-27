import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
  
  @Entity('notification')
  export class Notification extends Base {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'nvarchar', length: 'MAX', nullable: true})
    content: string;
    
    @Column({type: 'nvarchar', length: 'MAX', nullable: true})
    title: string;
    
    @Column()
    userId: string;

    @ManyToOne(
        type => User,
        user => user,
    )
    @JoinColumn({ name: 'userId' })
    user: User;
  }
  