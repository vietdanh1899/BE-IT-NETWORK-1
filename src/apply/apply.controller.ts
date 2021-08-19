import { Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppliedJob } from 'src/entity/applied_job.entity';
import { CV } from 'src/entity/cv.entity';
import { Job } from 'src/entity/job.entity';
import { JobToCv } from 'src/entity/jobtocv.entity';
import { User } from 'src/entity/user.entity';
import { getManager, getRepository, In } from 'typeorm';
import { UploadedFile } from  '@nestjs/common';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('apply')
export class ApplyController {
    private readonly manager = getManager();

    @Get('/getfile/:fileId')
    serveFile(@Param('fileId') fileId: string, @Res() res) {
        res.sendFile(fileId, { root: 'uploads' }) ;
    }
   
    @Post('/upload')
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
    @UseInterceptors(FileInterceptor('file',
      {
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
        })
      }
    )
    )
    upload(@UploadedFile() file) {
        console.log(file);
        return {
            url: `https://vietdanh.loca.lt/apply/getfile/${file.filename}`,
        };
    }
    
    @Get('/cv/:userId')
    async getCv(@Param('userId') userId: string) {
        try {
            const user = await getRepository(User).findOne(userId, {relations: ["profile", "profile.cvs"]});
            // console.log(user);
            // const profile = await getRepository(Profile).findOne(user.profile, {relations: ["cvs"]});
            // console.log(profile);
            return user.profile.cvs;
        }
        catch (err) {
            console.error(err);
            throw new InternalServerErrorException();
        }
    }

    @Post('/cv/:userId')
    async upCv(@Param('userId') id: string, @Body() body) {
        try {
            const cv = new CV();
            cv.name = body.name;
            cv.cvURL = body.cvURL;
            const user: User = await getRepository(User).findOne(id, {relations: ["profile"]});
            cv.profile = user.profile;
            return await this.manager.save(cv);
        }
        catch (error) {
            console.log('err', error)
            throw new InternalServerErrorException();
        }
    }

    @Delete('/cv/:CVid')
    async deleteCv(@Param('CVid') CVid: string) {
        try {
            const cv: CV = await getRepository(CV).findOne(CVid);
            const sjtc = await getRepository(JobToCv).find({cvId: cv.id});
            if (sjtc.length) return "Applied cv cannot be delete";
            else return await getRepository(CV).delete(cv);
        }
        catch (err) {
            console.error(err);
            throw new InternalServerErrorException();
        }
    }

    @Post('/:jobId')
    async applyJob(@Param('jobId') jobId: string, @Body('cvId') cvId: string) {
        try {
            const appliedjob = await getRepository(JobToCv).findOne({where : {jobId: jobId, cvId: cvId}});
            if (appliedjob) throw new ConflictException('Job already applied');
            const jobToCv = new JobToCv();
            const job = await getRepository(Job).findOne(jobId);
            const cv = await getRepository(CV).findOne(cvId, {relations: ["profile", "profile.user"]});
            jobToCv.job = job;
            jobToCv.cv = cv;
            await getRepository(AppliedJob).insert({userId: cv.profile.user.id, jobId: job.id});
            return await this.manager.save(jobToCv);
        }
        catch (err) {
            console.error(err);
            throw new InternalServerErrorException();
        }
    }

    @Get('/:userId')
    async getAppliedJobsByUser(@Param('userId') userId: string) {
        const user: User = await getRepository(User).findOne(userId, {relations: ["profile", "profile.cvs"]});
        const cvs = user.profile.cvs;
        // console.log(cvs);
        // return cvs;
        // console.log(cvs[0]);
        console.log(cvs.map((cv) => cv.id));
        if (!cvs.length) return null;
        return await getRepository(JobToCv).find({cvId: In(cvs.map((cv) => cv.id))});
        // console.log(appliedJobs);
    }

    
}


