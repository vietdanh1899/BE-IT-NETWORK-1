// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');
// //Drive API, v3
// //https://www.googleapis.com/auth/drive	See, edit, create, and delete all of your Google Drive files
// //https://www.googleapis.com/auth/drive.file View and manage Google Drive files and folders that you have opened or created with this app
// //https://www.googleapis.com/auth/drive.metadata.readonly View metadata for files in your Google Drive
// //https://www.googleapis.com/auth/drive.photos.readonly View the photos, videos and albums in your Google Photos
// //https://www.googleapis.com/auth/drive.readonly See and download all your Google Drive files
// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   //authorize(JSON.parse(content), listFiles);
//   //authorize(JSON.parse(content), listFiles);
//   authorize(JSON.parse(content), uploadFile);
//   // authorize(JSON.parse(content), createFolder);
//   // authorize(JSON.parse(content), download);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const { client_secret, client_id, redirect_uris } = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//     client_id,
//     client_secret,
//     redirect_uris[0],
//   );

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client); //list files and upload file
//     //callback(oAuth2Client, '0B79LZPgLDaqESF9HV2V3YzYySkE');//get file
//   });
// }
// // function getAccessToken(oAuth2Client, callback) {
// //   const authUrl = oAuth2Client.generateAuthUrl({
// //     access_type: 'offline',
// //     scope: SCOPES,
// //   });
// //   console.log('Authorize this app by visiting this url:', authUrl);
// //   const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout,
// //   });
// //   rl.question('Enter the code from that page here: ', code => {
// //     rl.close();
// //     oAuth2Client.getToken(code, (err, token) => {
// //       if (err) return console.error('Error retrieving access token', err);
// //       oAuth2Client.setCredentials(token);
// //       // Store the token to disk for later program executions
// //       fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
// //         if (err) return console.error(err);
// //         console.log('Token stored to', TOKEN_PATH);
// //       });
// //       callback(oAuth2Client);
// //     });
// //   });
// // }

// function uploadFile(auth) {
//   const drive = google.drive({ version: 'v3', auth });
//   var fileMetadata = {
//     name: 'image.jpg',
//     parents: ['1Fz4i97zoLQYPvmKKZG27F07HIOX1mIrr'],
//   };
//   var media = {
//     mimeType: 'image/jpeg',
//     body: fs.createReadStream('uploads/photo'),
//   };
//   drive.files.create(
//     {
//       resource: fileMetadata,
//       media: media,
//       fields: 'id',
//     },
//     function(err, res) {
//       if (err) {
//         // Handle error
//         console.log(err);
//       } else {
//         console.log('File Id: ', res);
//       }
//     },
//   );
// }

// function listFiles(auth) {
//   const drive = google.drive({ version: 'v3', auth });
//   drive.files.list(
//     {
//       pageSize: 10,
//       fields: 'nextPageToken, files(id, name)',
//     },
//     (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const files = res.data.files;
//       if (files.length) {
//         console.log('Files:');
//         files.map(file => {
//           console.log(file);
//         });
//       } else {
//         console.log('No files found.');
//       }
//     },
//   );
// }

// function createFolder(auth) {
//   const drive = google.drive({ version: 'v3', auth });
//   var fileMetadata = {
//     name: 'Image',
//     mimeType: 'application/vnd.google-apps.folder',
//   };
//   drive.files.create(
//     {
//       resource: fileMetadata,
//       fields: 'id',
//     },
//     function(err, file) {
//       if (err) {
//         // Handle error
//         console.error(err);
//       } else {
//         console.log('Folder Id: ', file.id);
//       }
//     },
//   );
// }

const fs = require('fs');
const { google } = require('googleapis');

const googleClientId =
  '435706040258-at00j7hvj73v113r1b03atfmn1to44hl.apps.googleusercontent.com';
const googleClientSecret = 'v1XkJVC9Erm4zBqouxIs4Rmp';
const googleRefreshToken =
  '1//0eIaY1aALm8y6CgYIARAAGA4SNwF-L9Irg9qo3TkJb5DFYaAgXeAoiDHIyrpPWyU2ZQL--pDuoU9INZZrjuuKwIPP9BJ5jEnnov8';

const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  'http://localhost',
);
oauth2Client.setCredentials({ refresh_token: googleRefreshToken });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

async function main() {
  var fileMetadata = {
    name: 'test.jpg',
    parents: ['1Fz4i97zoLQYPvmKKZG27F07HIOX1mIrr'],
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('uploads/photo'),
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    function(err, res) {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log('File Id: ', res);
      }
    },
  );
}

main();
