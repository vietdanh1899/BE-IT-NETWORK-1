import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { JobService } from './App/jobs/jobs.service';
import * as _ from 'lodash';
import { after } from 'lodash';

const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('The Career Network API Documentation')
    .setDescription('The Career Network API Documentation description')
    .setVersion('3.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(port);
  Logger.log(`Server running on htttp://localhost:${port}`);
  const jobService = app.get(JobService);
  const items = await jobService.getAllItemProfile();
  console.log('--->items', items);
  
  const tags = await jobService.getAllCurrentTags();

  const filterArr = _.map(items, o => {
    o.value = tags.map(x => o.value.indexOf(x.name) > -1 ? 1 : 0);
    return o;
  });

  // console.log('--->filterArr', filterArr);
  
}

bootstrap();
