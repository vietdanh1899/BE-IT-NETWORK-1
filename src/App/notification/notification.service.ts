import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PaginationOption } from 'src/common/Paginate';
import { Notification } from 'src/entity/notification.entity';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification>  {
    constructor(
        @InjectRepository(Notification) repo,
        private readonly repository: NotificationRepository,
      ) {
        super(repo);
      }


    async getNotification(req: PaginationOption, userId: string) {
        return this.repository.paginate({limit: req.limit, page: req.page}, {relations: []}, {condition: {userId: userId}});
    }

}
