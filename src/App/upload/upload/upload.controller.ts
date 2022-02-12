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
    }, (err, response) => {
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



  // createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
  //   const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  //   client.setCredentials({ refresh_token: refreshToken });

  //   return google.drive({
  //     version: 'v3',
  //     auth: client,
  //   });
  // }

  // async uploadFile(@UploadedFile() file, @Res() res) {
  //   console.log('-->interceptor');
    
  //   this.path = file.path;
  //   await fs.readFile('credentials.json', async (err, content: any) => {
  //     if (err) {
  //       throw new InternalServerErrorException('Error client secret file');
  //     }

  //     await this.authorize(JSON.parse(content), async auth => {
  //       await this.uploadImage(auth, file.path, res);
  //     });
  //   });
  // }

  // authorize(credentials: any, callback: any) {
  //   const TOKEN_PATH = 'token.json';
  //   // eslint-disable-next-line @typescript-eslint/camelcase
  //   const { client_secret, client_id, redirect_uris } = credentials.web;
  //   const oAuth2Client = new google.auth.OAuth2(
  //     client_id,
  //     client_secret,
  //     // eslint-disable-next-line @typescript-eslint/camelcase
  //     redirect_uris[0],
  //   );
  //   console.log('-->read token');
    
  //   // Check if we have previously stored a token.
  //   fs.readFile(TOKEN_PATH, (err, token: any) => {
  //     if (err) {
  //       throw new HttpException(
  //         {
  //           message: 'Internal Server Error',
  //           status: HttpStatus.BAD_REQUEST,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     // oAuth2Client.setCredentials(JSON.parse(token));
  //     callback(oAuth2Client); //list files and upload file
  //   });
  // }

  async uploadImage(auth, path, @Res() response) {
    const drive = google.drive({ version: 'v3', auth });
    const metaData = {
      //   mimeType: 'image/jpeg',
      body: fs.createReadStream(path),
    };
    const unlinkAsync = promisify(fs.unlink);
    const fileMetadata = {
      name: 'image.jpg',
      parents: ['1Oz126Pce5-0P-qDjNr_ag8o73PBIxxu-'],
    };
    console.log('path', path);
    await drive.files.create(
      {
        resource: fileMetadata,
        media: metaData,
        fields: 'id',
      },
      async function(err, res) {
        if (err) {
          // Handle error
          throw new HttpException(
            {
              message: 'Internal Server Error',
              status: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
          );
        } else {
          await unlinkAsync(path);
          response.json({
            data: {
              url: `https://drive.google.com/uc?id=${res.data.id}`,
            },
          });
        }
      },
    );
  }
}
