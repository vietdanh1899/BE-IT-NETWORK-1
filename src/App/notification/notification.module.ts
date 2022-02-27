import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationRepository
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
