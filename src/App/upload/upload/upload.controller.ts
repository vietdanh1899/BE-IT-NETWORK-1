import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import fs = require('fs');
import { promisify } from 'util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

@Controller('api/v1/upload')
export class UploadController {
  private path: string;
  private url: string;
  private driveClient;
  private readonly clientId: string = "412128120694-amgbn8h4gm4kej0383mf8vud30harb13.apps.googleusercontent.com";
  private readonly clientSecret:string = "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";
  private readonly redirectUri: string = "https://developers.google.com/oauthplayground";
  private readonly refreshToken:string = "1//04i_RjCFUwAw7CgYIARAAGAQSNwF-L9IrCpxdUV7lQSuVQXHwNCE-bALuuw_TV5uMsGgXOI_PXNcV_z957RYUUumV1v9-Rl9gx1M";

  /**
   *
   */
  
  /**
   *
   */

  
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype != 'application/pdf' &&
          file.mimetype != 'image/jpeg' &&
          file.mimetype != 'image/png'
        ) {
          cb(
            new BadRequestException(`Unsupported file Type ${file.mimetype}`),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  saveFile(@UploadedFile() file, @Res() res) {
    const client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
    const unlinkAsync = promisify(fs.unlink);

    client.setCredentials({ refresh_token: this.refreshToken });

    this.driveClient = google.drive({
      version: 'v3',
      auth: client,
    });

     this.driveClient.files.create({
      requestBody: {
        name: file.filename,
        mimeType: file.mimetype,
        parents: ['1Oz126Pce5-0P-qDjNr_ag8o73PBIxxu-']
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    }, async (err, response) => {
      await unlinkAsync(file.path);
      res.json({
        data: {
          url: `https://drive.google.com/uc?id=${response.data.id}`,
        },
      });
    });
  }


  createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }
}
