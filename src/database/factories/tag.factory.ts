import { define } from 'typeorm-seeding';	
import * as Faker from 'faker';	
import { Tag } from '../../entity/tag.entity';	
import { getSlug } from '../../core/utils/helper';	

define(Tag, (faker: typeof Faker, context: { payload?: Tag }) => {	
  const { payload } = context;	

  const name = payload.name;	

  const tag = new Tag();	
  tag.name = name;	
//   tag.author = payload.author;	
  return tag;
});	
