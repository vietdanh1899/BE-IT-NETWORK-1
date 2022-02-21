import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Address } from './address.entity';
  import { Base } from './base.entity';
  import { Job } from './job.entity';
  import { User } from './user.entity';
  
  @Entity('user_address')
  export class UserAddress extends Base {
    @Column({ type: 'uuid' })
    userId: string;
  
    @Column({ type: 'uuid' })
    addressId: string;
  
    @PrimaryGeneratedColumn()
    index_name: number;
  
    @ManyToOne(
      type => Address,
      address => address.user,
    )
    @JoinColumn({ name: 'addressId' })
    address: Address;
  
    @ManyToOne(
      type => User,
      user => user.address,
    )
    @JoinColumn({ name: 'userId' })
    user: User;
  }
  