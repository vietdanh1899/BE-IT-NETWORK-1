import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, getConnection } from 'typeorm';
import { SqlReader } from 'node-sql-reader'
import * as path from 'path';
export default class CreateTrigger implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
     const queryRunner = connection.createQueryRunner();
        let queries = SqlReader.readSqlFile(path.join(__dirname, "../data/*.sql"))
        console.log('--->query', queries);
        
    }
}
