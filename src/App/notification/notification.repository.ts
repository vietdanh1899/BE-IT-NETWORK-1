import { BaseRepository } from 'src/common/Base/base.repository';
import { EntityRepository, Repository } from 'typeorm';
import { NotificationDTO } from './notification.dto';
import * as admin from 'firebase-admin';
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api';
import { Notification } from 'src/entity/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {

    /**
     *
     */
    async addNewNotification(payload: NotificationDTO, appTokens: Array<string>) {
        console.log('--->applied');
        const registrationToken = 'dPRe8mMXRUyipjwHEY1toi:APA91bEi3EFHAOfeZRBTaucB0bHTxpw5lIxanGrtGiqO4O0Kp4ilaYMV2Yw5LQWtee61JHKOKD0Nvm4D5eoHrs6CHTpkSAxcieNMTvgv_2-mAxNw0G0h9dMNeoL4LLFQAXH8SVrsLMyD';

// See the "Defining the message payload" section below for details
// on how to define a message payload.
            const data = {
                payload
            };
        await admin
            .messaging()
            .sendToDevice(appTokens,
            {
                notification: {body: 'send from server 2 ', title: 'send from server 2'}
            }
            )
            // .sendToTopic("client", {notification: {body: 'send from server', title: 'client'}})
            .then(response => {
            console.log('Successfully sent message:', response);
            })
            .catch(error => {
            console.log('Error sending message:', error);
            });
        const entries =  await this.create({...payload});
        
        await this.save(entries);
    }
}
