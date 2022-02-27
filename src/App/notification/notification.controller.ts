import { Controller, Get, UseGuards,  Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserSession } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

    constructor(
        public service: NotificationService,
      ) {
      }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getNotification(@Request() req, @UserSession() user) {
      try {
        const { id } = user.users;
        const limit = req.query.hasOwnProperty('limit') ? req.query.limit : 10;
        const page = req.query.hasOwnProperty('page') ? req.query.page : 1;
        const sort = req.query.hasOwnProperty('sort') ? req.query.sort : null;
        return await this.service.getNotification({limit, page, sort}, id);
      } catch (err) {
        throw err;
      }
    }
}
