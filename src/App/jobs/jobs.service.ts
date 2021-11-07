import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Job } from 'src/entity/job.entity';
import { JobRepository } from './jobs.repository';
import { getManager, getRepository, In } from 'typeorm';
import { UserRepository } from '../users/user.repository';
import { CategoryRepository } from '../categories/categories.repository';
import axios from 'axios';
import { AddressRepository } from '../address/address.repository';
import { AppliesJobRepo } from './jobApplies.repository';
import * as _ from 'lodash';
import { User } from 'src/entity/user.entity';
import { JobToCv } from 'src/entity/jobtocv.entity';
import { isUUID } from 'class-validator';
import RoleId from 'src/types/RoleId';
import { JobRecently } from 'src/entity/job_recently.entity';
import { timeStamp } from 'console';

@Injectable()
export class JobService extends TypeOrmCrudService<Job> {
  private tableName = 'job_favorite ';
  private job_applied = 'applied_job';
  private readonly manager = getManager();

  constructor(
    @InjectRepository(Job) repo,
    private readonly repository: JobRepository,
    private readonly userRepository: UserRepository,
    private readonly cateRepository: CategoryRepository,
    private readonly addressRepository: AddressRepository,
    private readonly appliesJobRepo: AppliesJobRepo,
  ) {
    super(repo);
  }

  async addFavoritesJob(jobId: string, userId: string) {
    const manager = getManager();
    const job = await this.repository.findOne({ where: { id: jobId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!job) {
      throw new NotFoundException(`Job not found`);
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const favoritesByUser = await manager.query(
        `SELECT * FROM ${this.tableName} WHERE "jobId"='${jobId}' and "userId"='${userId}'`,
      );

      if (favoritesByUser.length == 0) {
        await manager.query(
          `INSERT INTO ${this.tableName} values('${jobId}','${userId}')`,
        );
        return { status: true };
      } else {
        await manager.query(
          `DELETE FROM ${this.tableName} WHERE "jobId"='${jobId}' and "userId"='${userId}'`,
        );
        return { status: false };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal Server Error Exception ${error}`,
      );
    }
  }

  async getFavoritesByUser(userId: string) {
    const manager = getManager();
    const favoritesJob = await manager.query(
      `SELECT * FROM ${this.tableName} WHERE "userId"='${userId}'`,
    );

    const jobIds = favoritesJob.map(job => job.jobId);
    const jobByIds = await this.repository.findByIds(jobIds, {
      relations: ['user', 'user.profile', 'categories'],
    });
    return jobByIds.map(job => {
      delete job.user.password;
      delete job.user.ExpiredToken;
      delete job.user.ExpiredToken;
      return job;
    });
  }

  async appliesJob(jobId: string, userId: string) {
    const manager = getManager();
    const job = await this.repository.findOne({ where: { id: jobId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!job) {
      throw new NotFoundException(`Job not found`);
    }

    if (!user || user.roleId === RoleId.CONTRIBUTOR) {
      throw new NotFoundException('Current User is not available');
    }
    try {
      const jobApplied = await manager.query(
        `SELECT * FROM ${this.job_applied} WHERE "jobId"='${jobId}' and "userId"='${userId}'`,
      );

      if (jobApplied.length == 0) {
        const createJob = this.appliesJobRepo.create({ user, jobId });
        await this.appliesJobRepo.save(createJob);
        return { status: true };
      } else {
        throw new ConflictException('Job has been already applied');
      }
    } catch (error) {
      throw error;
    }
  }

  async createJob(dto: Job) {
    try {
      const { latitude, longitude } = dto;
      const provinces = await await axios.get(
        'https://vapi.vnappmob.com/api/province',
      );
      let createAddr: any;
      for (let index = 0; index < provinces.data.results.length; index++) {
        console.log(provinces.data.results[index]);

        if (provinces.data.results[index].province_id == dto.city) {
          createAddr = this.addressRepository.create({
            latitude,
            longitude,
            city: dto.city,
            description: dto.street,
          });
          createAddr = await this.addressRepository.save(createAddr);
          break;
        }
      }
      if (!createAddr) {
        return new BadRequestException('Address is invalid type');
      }
      const findCateIds = await this.cateRepository.findByIds(dto.cateIds);
      const createJob = this.repository.create({
        ...dto,
        categories: findCateIds,
        address: createAddr,
      });
      return await this.repository.save(createJob);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal Server Error Exception ${error}`,
      );
    }
  }

  async getJobAppliedByCompany(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const manager = getManager();
    const jobApplied = await manager.query(
      `SELECT * FROM ${this.job_applied} WHERE "userId"='${userId}'`,
    );

    const jobIds = jobApplied.map(job => job.jobId);
    const jobByIds = await this.repository.findByIds(jobIds, {
      relations: ['user', 'user.profile', 'categories'],
    });
    return jobByIds.map(job => {
      delete job.user.password;
      delete job.user.ExpiredToken;
      delete job.user.ExpiredToken;
      return job;
    });
  }

  async getListUserAppliedJob(contributorId: string) {
    console.log('da zo get list');
    const contributor = await this.userRepository.findOne({
      where: { id: contributorId },
    });
    if (!contributor) {
      throw new NotFoundException('User not found');
    }

    const allCompanyJob = await this.repository.find({
      where: { user: contributor },
      relations: ['jobToCvs', 'jobToCvs.cv','jobToCvs.cv.profile','jobToCvs.cv.profile.user','jobToCvs.cv.profile.user.profile'],
    });
    const valuereturn = allCompanyJob.map(job => {
        const applieduser = job.jobToCvs.map((jtc) => {
          // console.log('co jtc',jtc);
          return {
            createdat: jtc.createdat,
            cvId: jtc.cv.id,
            cvURL: jtc.cv.cvURL,
            user: jtc.cv.profile.user,
            status: jtc.status,
            isDenied: jtc.isDenied
          };
        });
      return {
        ...job,
        appliedBy: applieduser
      };
    });
    valuereturn.forEach((j) => console.log(j.appliedBy));
    return valuereturn;
  }

  async acceptJob(userId: string, jobId: string, contriButeId: string) {
    const user = await this.userRepository.findOne({
      where: { id: contriButeId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const manager = getManager();

    try {
      const jobApplied = await manager.query(
        `SELECT * FROM ${this.job_applied} WHERE "userId"='${userId}' AND "jobId"='${jobId}'`,
      );
      if (jobApplied.length > 0) {
        await manager.query(
          `UPDATE ${this.job_applied} set "status"= true WHERE "userId"='${userId}' AND "jobId"='${jobId}'`,
        );
        {
          const user: User = await getRepository(User).findOne(userId, {relations: ["profile", "profile.cvs"]});
          const cvs = user.profile.cvs;
          if (!cvs.length) return null;
          const sjobToCv = await getRepository(JobToCv).find({jobId: jobId,cvId: In(cvs.map((cv) => cv.id))});
          sjobToCv.forEach(jobToCV => {
            console.log(jobToCV);
            manager.query(
              `UPDATE "job_to_cv" set "status"= true, "isDenied"=false WHERE "jobToCvId"='${jobToCV.jobToCvId}'`
            );
          })
        }
        return {
          status: true,
        };
      }
    } catch (err) {
      throw new NotFoundException(' not found');
    }
  }

  async getOneJobAppliedUser(id: string) {
    try {
      const findJob = await this.repository.find({
        where: { id: id },
        relations: ['jobToCvs', 'jobToCvs.cv','jobToCvs.cv.profile','jobToCvs.cv.profile.user','jobToCvs.cv.profile.user.profile'],
      });

      if (!findJob) {
        return new NotFoundException('Job not found');
      }

      const valuereturn = findJob.map((job) => {
        const applieduser = job.jobToCvs.map((jtc) => {
          return {
            createdat: jtc.createdat,
            cvId: jtc.cv.id,
            cvURL: jtc.cv.cvURL,
            user: jtc.cv.profile.user,
            status: jtc.status,
            isDenied: jtc.isDenied
          };
        });
        return {
          ...job,
          appliedBy: applieduser
        };
      })
      return valuereturn;
        
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: 'Internal Server Error',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAllFavoriteJob() {
    const manager = getManager();
    return await manager.query(
      `SELECT distinct("jobId") FROM ${this.tableName}`
    );
  }

  async getAllFavoriteJobByUserId(userId: string) {
    if (!isUUID(userId)) return [];
    const manager = getManager();
    const jobFavorite = await manager.query(
      `SELECT distinct("jobId") FROM ${this.tableName} WHERE "userId"='${userId}'`
    );
    if (!jobFavorite) return [];
    else return jobFavorite;
  }
  async getAllAppliedJob(userId: string) {
    if (!isUUID(userId)) return [];
    const user: User = await getRepository(User).findOne(userId, {relations: ["profile", "profile.cvs"]});
    const cvs = user.profile.cvs;
    if (!cvs.length) return [];
    else return await getRepository(JobToCv).find({cvId: In(cvs.map((cv) => cv.id))});
  }

  async updateRecently(userId: string, jobId: string) {
    try {
      const entries = await getRepository(JobRecently).findOne({where: {jobId: jobId, userId: userId}})
      
      if(!entries) {
        
        const jobRecently = new JobRecently();
        jobRecently.jobId = jobId;
        jobRecently.userId = userId
        jobRecently.count = 1;
        await this.manager.save(jobRecently);
      } else {
        entries.count +=1 ;
        await this.manager.save(entries);
      }
    } catch(err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllAcceptedUser(id: string) {
    try {
      const contributor = this.userRepository.findOne({ id: id });
      const allCompanyJob = await this.repository.find({
        where: { user: contributor },
        relations: ['appliedBy', 'appliedBy.user', 'appliedBy.user.profile'],
      });
      // return allCompanyJob.map(job => {
      //   return job.appliedBy.filter(applied => {
      //     return applied.status == true;
      //   })
      //   return job;
      // });
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAcceptedUserByJobId(id: string) {
    try {
      const manager = getManager();
      const acceptedUser = await manager.query(
        `SELECT "userId" FROM applied_job WHERE "jobId" = '${id}' and "status" = true`,
      );
      const userIds = acceptedUser.map(user => {
        return user.userId;
      });
      return await this.userRepository.findByIds(userIds, {
        relations: [
          'profile',
        ],
      });
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllItemProfile()
  {
    return this.repository.getAllProfileItem();
  }
  
  async getAllCurrentTags()
  {
    return this.repository.getAllCurrentTagsAsync();
  }
}
