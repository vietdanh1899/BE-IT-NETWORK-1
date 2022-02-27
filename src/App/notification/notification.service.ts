import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PaginationOption } from 'src/common/Paginate';
import { Notification } from 'src/entity/notification.entity';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification>  {
    constructor(
        @InjectRepository(Notification) repo,
      ) {
        super(repo);
      }


    async getNotification(req: PaginationOption, userId: string) {
        console.log('-->get notiifcation');
        
    }

}
