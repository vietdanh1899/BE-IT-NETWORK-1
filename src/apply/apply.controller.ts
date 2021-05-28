import { Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobRepository } from 'src/App/jobs/jobs.repository';
import { CV } from 'src/entity/cv.entity';
import { Job } from 'src/entity/job.entity';
import { JobToCv } from 'src/entity/jobtocv.entity';
import { Profile } from 'src/entity/profile.entity';
import { User } from 'src/entity/user.entity';
import { Any, Connection, getManager, getRepository, In } from 'typeorm';

@Controller('apply')
export class ApplyController {
    private readonly manager = getManager();
    // private readonly jobRepository = getRepository(Job);
    // private readonly userRepository = getRepository(User);
    // private readonly cvRepository = getRepository(CV);

    
    
    @Get('/cv/:userId')
    async getCv(@Param('userId') userId: string) {
        try {
            const user = await getRepository(User).findOne(userId, {relations: ["profile", "profile.cvs"]});
            console.log(user);
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
            return await getRepository(CV).delete(cv);
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
            jobToCv.job = await getRepository(Job).findOne(jobId);
            jobToCv.cv = await getRepository(CV).findOne(cvId);
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
        return await getRepository(JobToCv).find({cvId: In(cvs.map((cv) => cv.id))});
        // console.log(appliedJobs);
    }
}
